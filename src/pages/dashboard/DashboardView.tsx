import { useState } from "react"

const info = [
    {id: 1, title: "Total Users", value: 1000},
    {id: 2, title: "Total Revenue", value: 50000},
    {id: 3, title: "Total Orders", value: 1000}
]

const DashboardView = () => {
    const [data, setData] = useState(info)

    return (
        <div className="px-4 py-6 max-w-4xl mx-auto">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 min-w-max">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-3 text-left bg-gray-50 dark:bg-gray-900">Título</th>
                            <th className="border border-gray-300 p-3 text-left bg-gray-50 dark:bg-gray-900">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                <td className="border border-gray-300 p-3">{item.title}</td>
                                <td className="border border-gray-300 p-3 font-semibold">{item.value.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DashboardView