import React, { useState, useEffect, useCallback, useRef } from "react";
import { FixedSizeGrid as Grid, FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import BackendApi from '../services/BackendApi'
import { useNavigate, useSearchParams } from "react-router-dom";


function SearchBar({ onSearch }) {
    const [input, setInput] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const onSubmit = () => {
        if (input.trim()) onSearch(["name", input.trim()]);

        else onSearch([]);
    };
    return (
        <div className="flex">
            <input
                className="border rounded p-1 flex-grow"
                value={input}
                onChange={(e) => {
                    const value = e.target.value;
                    setInput(value);
                    setSearchParams(prev => {
                        const params = new URLSearchParams(prev);
                        if (value.trim()) {
                            params.set("search", value.trim());
                        } else {
                            params.delete("search");
                        }
                        return params;
                    });
                }}
                placeholder="Search by name..."
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSubmit();
                }}
            />
            <button
                className="ml-2 px-3 py-1 border rounded bg-blue-600 text-white"
                onClick={onSubmit}
            >
                Search
            </button>
        </div>
    );
}

export default function DashboardContent() {
    const pageSize = 10;
    const [employees, setEmployees] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMap, setLoadingMap] = useState({});
    const [type, setType] = useState("grid");
    const [filter, setFilter] = useState("api/employee");
    const navigate = useNavigate()
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(1000);
    const [columnCount, setColumnCount] = useState(4);
    const gap = 16;
    const rowHeight = 130;
    const adjustedRowHeight = rowHeight + gap;
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");

    useEffect(() => {
        const param = searchParams.get("search") || "";
        setSearch(param);
    }, [searchParams]);

    const [url, setUrl] = useState('')

    useEffect(() => {
        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(searchParams)) {
            params.set(key, value);
        };
        setUrl(params)
    }, [searchParams])
    const adjustedColumnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;

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
    console.log(url)
    // Calculate rows and items count
    const hasNextRow = hasMore && (employees.length % columnCount === 0);
    const rowCount = Math.ceil(employees.length / columnCount) + (hasNextRow ? 1 : 0);
    const itemCount = rowCount * columnCount;

    const isItemLoaded = ({ rowIndex, columnIndex }) => {
        const index = rowIndex * columnCount + columnIndex;
        return !!employees[index];
    };

    const loadMoreItems = useCallback(async () => {
        if (!hasMore) return;

        const offset = employees.length;
        const pageIndex = Math.floor(offset / pageSize);

        if (loadingMap[pageIndex]) return;

        setLoadingMap((prev) => ({ ...prev, [pageIndex]: true }));

        try {
            const searchQuery =
                search.length === 2 ? `&${search[0]}=${encodeURIComponent(search[1])}` : "";
            const response = await BackendApi.get(
                `${filter}/?limit=${pageSize}&offset=${offset}${searchQuery}`
            );
            const newEmployees = response.data?.results || [];
            setEmployees((prev) => [...prev, ...newEmployees]);
            if (newEmployees.length < pageSize) setHasMore(false);
        } catch (error) {
        } finally {
            setLoadingMap((prev) => {
                const updated = { ...prev };
                delete updated[pageIndex];
                return updated;
            });
        }
    }, [employees.length, hasMore, loadingMap, filter, search]);

    // Reload data on filter or search change
    useEffect(() => {
        const fetchInitial = async () => {
            setEmployees([]);
            setHasMore(true);
            setLoadingMap({});
            try {
                const searchQuery =
                    search.length === 2 ? `&${search[0]}=${encodeURIComponent(search[1])}` : "";

                const response = await BackendApi.get(
                    `${filter}/?limit=${pageSize}&offset=0${searchQuery}`
                );
                const newEmployees = response.data?.results || [];
                setEmployees(newEmployees);
                if (newEmployees.length < pageSize) setHasMore(false);
            } catch (error) {
            }
        };
        fetchInitial();
    }, [filter, search]);
    const ClickHandling = (emp) => {
        navigate(`dashboard/employee/${emp.id}`)

    }
    // Key cho InfiniteLoader/Grid để reset khi filter/search thay đổi
    const searchKey = search.length === 2 ? `${search[0]}-${search[1]}` : "";

    return (
        <div className="w-full border rounded bg-gray-100 p-4" ref={containerRef}>
            {/* Search Bar */}
            <div className="mb-4 w-[30%] float-right">
                <SearchBar onSearch={setSearch} />
            </div>

            {/* Toggle Buttons */}
            <div className="flex justify-end space-x-2 mb-4 clear-both">
                <button
                    className={`px-4 py-2 border rounded ${type === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-800 hover:bg-gray-100"
                        }`}
                    onClick={() => setType("grid")}
                >
                    <i className="fa fa-address-card" aria-hidden="true"></i>
                </button>
                <button
                    className={`px-4 py-2 border rounded ${type === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-800 hover:bg-gray-100"
                        }`}
                    onClick={() => setType("list")}
                >
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            {/* Filter sidebar and content */}
            <div className="flex justify-between">
                <div className="w-[15%] pr-4">
                    <section>
                        <header className="font-bold mb-2">Filter</header>
                        <ul className="space-y-2 text-sm">
                            <li className="cursor-pointer hover:text-blue-600" onClick={() => setFilter("api/employee")}>
                                Tất cả
                            </li>
                            <li
                                className="cursor-pointer hover:text-blue-600"
                                onClick={() => setFilter("api/employee/stored_employee")}
                            >
                                Stored
                            </li>
                        </ul>
                    </section>
                </div>

                <div className="w-[85%]">
                    {type === "grid" ? (
                        <InfiniteLoader
                            key={`${filter}-${searchKey}`}
                            isItemLoaded={isItemLoaded}
                            itemCount={itemCount}
                            loadMoreItems={loadMoreItems}
                        >
                            {({ onItemsRendered, ref }) => (
                                <Grid
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
                                        visibleColumnStopIndex,
                                    }) => {
                                        const startIndex = visibleRowStartIndex * columnCount + visibleColumnStartIndex;
                                        const stopIndex = visibleRowStopIndex * columnCount + visibleColumnStopIndex;
                                        onItemsRendered({
                                            overscanStartIndex: startIndex,
                                            overscanStopIndex: stopIndex,
                                            visibleStartIndex: startIndex,
                                            visibleStopIndex: stopIndex,
                                        });
                                    }}
                                    ref={ref}
                                >
                                    {({ columnIndex, rowIndex, style }) => {
                                        const index = rowIndex * columnCount + columnIndex;
                                        if (index >= employees.length) return null; // 👈 Add this line
                                        const emp = employees[index];
                                        const adjustedStyle = {
                                            ...style,
                                            left: style.left + columnIndex * gap,
                                            top: style.top + rowIndex * gap,
                                            width: style.width - gap,
                                            height: style.height - gap,
                                        };
                                        return (
                                            <div
                                                style={adjustedStyle}
                                                className="text-sm flex flex-col justify-center border-2 rounded-2xl border-black shadow-amber-300 shadow-md"
                                            >
                                                {emp && (
                                                    <div className="m-5 cursor-pointer" onClick={() => ClickHandling(emp)}>

                                                        <div className="font-semibold">{emp.name}</div>
                                                        <div className="text-gray-500">{emp.age} tuổi</div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }}
                                </Grid>
                            )}
                        </InfiniteLoader>
                    ) : (
                        <InfiniteLoader
                            isItemLoaded={isItemLoaded}
                            itemCount={itemCount}
                            loadMoreItems={loadMoreItems}
                        >
                            {({ onItemsRendered, ref }) => (
                                <List
                                    height={500}
                                    itemCount={itemCount}
                                    itemSize={80}
                                    width={"100%"}
                                    onItemsRendered={onItemsRendered}
                                    ref={ref}
                                >
                                    {({ index, style }) => {
                                        const emp = employees[index];
                                        return (
                                            <div style={style} className="p-2">
                                                {emp ? (
                                                    <div className="border rounded bg-white p-3 shadow text-sm">
                                                        <div className="font-semibold">{emp.name}</div>
                                                        <div className="text-gray-500">{emp.age} tuổi</div>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-400 italic">Loading...</div>
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
