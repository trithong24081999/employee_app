import { useState, useEffect, useCallback, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import { FixedSizeGrid as Grid } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import BackendApi from "../services/BackendApi";

export default function DashboardContent() {
    const pageSize = 10;
    const [employees, setEmployees] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMap, setLoadingMap] = useState({});
    const [type, setType] = useState("grid"); // 'grid' or 'list'

    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(1000);
    const [columnCount, setColumnCount] = useState(4);
    const [filter, setFilter] = useState('api/employee');
    const gap = 16;

    const adjustedColumnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;
    const rowHeight = 130;
    const adjustedRowHeight = rowHeight + gap;
    const rowCount = Math.ceil(employees.length / columnCount) + (hasMore ? 1 : 0);
    const listCount = hasMore ? employees.length + 1 : employees.length;

    const isItemLoaded = ({ rowIndex, columnIndex }) => {
        const index = rowIndex * columnCount + columnIndex;
        return !!employees[index];
    };

    const isRowLoaded = index => !!employees[index];

    // Resize container and set column count
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth * 0.85;
                setContainerWidth(width);
                setColumnCount(width < 768 ? 1 : 4);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Load more items using offset based on employees.length
    const loadMoreItems = useCallback(async () => {
        if (!hasMore) return;

        const offset = employees.length;
        const pageIndex = Math.floor(offset / pageSize);

        if (loadingMap[pageIndex]) return;

        setLoadingMap(prev => ({ ...prev, [pageIndex]: true }));

        try {
            const response = await BackendApi.get(`${filter}/?limit=${pageSize}&offset=${offset}`);
            const newEmployees = response.data?.results || [];

            setEmployees(prev => [...prev, ...newEmployees]);
            if (newEmployees.length < pageSize) setHasMore(false);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoadingMap(prev => {
                const updated = { ...prev };
                delete updated[pageIndex];
                return updated;
            });
        }
    }, [employees.length, hasMore, loadingMap, filter]);

    // Reload data when filter changes
    useEffect(() => {
        const fetchInitial = async () => {
            setEmployees([]);
            setHasMore(true);
            setLoadingMap({});
            try {
                const response = await BackendApi.get(`${filter}/?limit=${pageSize}&offset=0`);
                const newEmployees = response.data?.results || [];
                setEmployees(newEmployees);
                if (newEmployees.length < pageSize) setHasMore(false);
            } catch (error) {
                console.error("Initial fetch error:", error);
            }
        };

        fetchInitial();
    }, [filter]);

    return (
        <div className="w-full border rounded bg-gray-100 p-4" ref={containerRef}>
            {/* Toggle Buttons */}
            <div className="flex justify-end space-x-2 mb-4">
                <button
                    className={`px-4 py-2 border rounded ${type === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-800 hover:bg-gray-100"}`}
                    onClick={() => setType("grid")}
                >
                    <i className="fa fa-address-card" aria-hidden="true"></i>
                </button>
                <button
                    className={`px-4 py-2 border rounded ${type === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-800 hover:bg-gray-100"}`}
                    onClick={() => setType("list")}
                >
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            <div className="flex justify-between">
                {/* Sidebar Filter */}
                <div className="w-[15%] pr-4">
                    <section>
                        <header className="font-bold mb-2">Filter</header>
                        <ul className="space-y-2 text-sm">
                            <li
                                className="cursor-pointer hover:text-blue-600"
                                onClick={() => setFilter('api/employee')}
                            >
                                Tất cả
                            </li>
                            <li
                                className="cursor-pointer hover:text-blue-600"
                                onClick={() => setFilter('api/employee/stored_employee')}
                            >
                                Stored
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Main content */}
                <div className="w-[85%]">
                    {type === "grid" ? (
                        <InfiniteLoader
                            key={filter}
                            isItemLoaded={isItemLoaded}
                            itemCount={rowCount * columnCount}
                            loadMoreItems={loadMoreItems}
                        >
                            {({ onItemsRendered, ref }) => (
                                <Grid
                                    key={filter}
                                    height={500}
                                    width={containerWidth}
                                    columnCount={columnCount}
                                    rowCount={rowCount}
                                    columnWidth={adjustedColumnWidth}
                                    rowHeight={adjustedRowHeight}
                                    onItemsRendered={({
                                        visibleRowStartIndex,
                                        visibleRowStopIndex,
                                        visibleColumnStartIndex,
                                        visibleColumnStopIndex
                                    }) => {
                                        const startIndex = visibleRowStartIndex * columnCount + visibleColumnStartIndex;
                                        const stopIndex = visibleRowStopIndex * columnCount + visibleColumnStopIndex;
                                        onItemsRendered({
                                            overscanStartIndex: startIndex,
                                            overscanStopIndex: stopIndex,
                                            visibleStartIndex: startIndex,
                                            visibleStopIndex: stopIndex
                                        });
                                    }}
                                    ref={ref}
                                >
                                    {({ columnIndex, rowIndex, style }) => {
                                        const index = rowIndex * columnCount + columnIndex;
                                        const emp = employees[index];
                                        const adjustedStyle = {
                                            ...style,
                                            left: style.left + columnIndex * gap,
                                            top: style.top + rowIndex * gap,
                                            width: style.width - gap,
                                            height: style.height - gap,
                                        };

                                        return (
                                            <div style={adjustedStyle} className="border rounded bg-white shadow text-sm flex flex-col justify-center">
                                                {emp ? (
                                                    <div className="m-5">
                                                        <div className="font-semibold">{emp.name}</div>
                                                        <div className="text-gray-500">{emp.age} tuổi</div>
                                                    </div>
                                                ) : (
                                                    <div className="italic text-gray-400 p-4">Đang tải...</div>
                                                )}
                                            </div>
                                        );
                                    }}
                                </Grid>
                            )}
                        </InfiniteLoader>
                    ) : (
                        <InfiniteLoader
                            key={filter}
                            isItemLoaded={isRowLoaded}
                            itemCount={listCount}
                            loadMoreItems={loadMoreItems}
                        >
                            {({ onItemsRendered, ref }) => (
                                <List
                                    key={filter}
                                    height={500}
                                    itemCount={listCount}
                                    itemSize={60}
                                    width={"100%"}
                                    onItemsRendered={onItemsRendered}
                                    ref={ref}
                                >
                                    {({ index, style }) => {
                                        const emp = employees[index];
                                        return (
                                            <div style={style} className="px-4 py-3 border-b bg-white text-sm flex flex-col justify-center">
                                                {emp ? (
                                                    <>
                                                        <div className="font-medium">{emp.name}</div>
                                                        <div className="text-gray-500">{emp.age} tuổi</div>
                                                    </>
                                                ) : (
                                                    <div className="italic text-gray-400">Đang tải...</div>
                                                )}
                                            </div>
                                        );
                                    }}
                                </List>
                            )}
                        </InfiniteLoader>
                    )}
                </div>
            </div>
        </div>
    );
}
