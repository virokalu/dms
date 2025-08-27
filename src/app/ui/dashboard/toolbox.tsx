export default function ToolBox({title}: {title : string}){
    return (
        <>
            <div className="mb-2 flex items-end justify-start rounded-md bg-blue-600 p-4 text-white">
                {title}
            </div>
        </>
    )
}