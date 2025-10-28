import React from 'react';
import { Image, Loader2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.jsx';

const ImageLabelsPanel = ({ imageLabels = [], onApplyImageLabel }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200/50 rounded-3xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md">
          <Image className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{t('ai.generatedImageLabels') || 'AI 图片标签'}</h3>
          <p className="text-sm text-gray-600">{t('ai.generatedImageLabelsDesc') || '左侧生成后将在此处展示，可一键应用到图标'}</p>
        </div>
      </div>

      {Array.isArray(imageLabels) && imageLabels.length > 0 ? (
        <div className="space-y-3">
          {imageLabels.map((imageLabel, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-200">
              <div className="flex items-center gap-3">
                <img
                  src={imageLabel.url}
                  alt={imageLabel.description || `图片标签 ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 items-center justify-center text-gray-400 text-xs hidden">
                  加载失败
                </div>
                <div className="flex-1">
                  <p className="text-emerald-700 font-medium text-sm">{imageLabel.description || '图片标签'}</p>
                  <p className="text-gray-500 text-xs mt-1">尺寸: {imageLabel.size || '1024x1024'}</p>
                </div>
              </div>
              <button
                onClick={() => onApplyImageLabel && onApplyImageLabel(imageLabel)}
                className="px-3 py-1 bg-emerald-500 text-white rounded-md text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                {t('ai.apply') || '应用'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-white rounded-xl border border-gray-200 text-center">
          <p className="text-sm text-gray-600">{t('ai.noImageLabels') || '暂无 AI 图片标签'}</p>
          <p className="text-xs text-gray-400 mt-1">{t('ai.generateHint') || '请在左侧 AI 助手中描述并生成'}</p>
        </div>
      )}
    </div>
  );
};

export default ImageLabelsPanel;