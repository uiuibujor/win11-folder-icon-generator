import React from 'react';
import { Download } from 'lucide-react';
import { canvasToICO } from '../utils/exportIcon.js';
import { useLanguage } from '../hooks/useLanguage.jsx';

const ExportControls = ({ exportFormat, onChangeExportFormat, canvasRef, fileName }) => {
  const { t } = useLanguage();
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    const name = fileName || 'folder';

    if (exportFormat === 'ico') {
      const icoBlob = canvasToICO(canvas, 256);
      link.download = `${name}.ico`;
      link.href = URL.createObjectURL(icoBlob);
    } else {
      link.download = `${name}.png`;
      link.href = canvas.toDataURL('image/png');
    }

    link.click();

    if (exportFormat === 'ico') {
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    }
  };

  return (
    <div className="mt-6 w-full space-y-4">
      <div className="bg-white rounded-xl p-4 border border-gray-200/50">
        <label className="block text-sm font-semibold text-gray-700">
          📁 {t('exportFormat')}
        </label>
        <select
          value={exportFormat}
          onChange={(e) => onChangeExportFormat(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white transition-colors text-sm lg:text-base"
        >
          <option value="png">{t('pngFormat')}</option>
          <option value="ico">{t('icoFormat')}</option>
        </select>
      </div>

      <button
        onClick={downloadImage}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
      >
        <Download className="w-5 h-5" />
        {t('downloadIcon')} ({exportFormat.toUpperCase()})
      </button>
    </div>
  );
};

export default ExportControls;