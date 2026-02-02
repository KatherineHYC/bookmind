export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          📚 Reading Tracker
        </h1>
        <p className="text-xl text-gray-600 mb-8">追蹤你的閱讀旅程</p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg">
          <span>專案建置中...</span>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}
