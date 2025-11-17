import { Link } from 'react-router-dom'

export default function ToolsList() {
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">趣味功能</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/tools/malware-scan" className="bg-white p-4 rounded shadow">
          <div className="font-semibold">恶意软件检测</div>
          <div className="text-sm text-gray-600">上传文件进行静态检测，仅用于学习演示</div>
        </Link>
      </div>
    </div>
  )
}