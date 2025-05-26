export default function Footer() {
    return (
        <div className="absolute h-[10%] bg-blue-400 w-full bottom-0 flex justify-around items-center">
            <div className="flex gap-2.5">
                Copyright by Thong
                <select className="ml-1 px-3 py-2 rounded cursor-pointer border-2 hover:border-amber-200">
                    <option value="one">One</option>
                    <option value="two">Two</option>
                </select>
            </div>
            <div>
                Power by Thong
            </div>

        </div>
    )
};