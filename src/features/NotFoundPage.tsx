import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md border border-white/20 text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-blue-200 text-xl mb-6">
          Esta isla no existe en el mapa
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
}
