import React from 'react';
import { Upload, X, Check } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage.jsx';
 

const LabelControls = ({
  showLabel,
  onToggleShowLabel,
  labelMode,
  onChangeLabelMode,
  labelText,
  onChangeLabelText,
  labelColor,
  onChangeLabelColor,
  fontFamily,
  onChangeFontFamily,
  fontOptions,
  fileInputRef,
  handleImageUpload,
  removeImage,
  customImage,
  imageSize,
  onChangeImageSize,
  imagePositionX,
  onChangeImagePositionX,
  imagePositionY,
  onChangeImagePositionY,
  // 图片遮罩开关
  clipImageToBody,
  onToggleClipImageToBody,
  // 新增：文字大小与位置
  textSize,
  onChangeTextSize,
  textPositionX,
  onChangeTextPositionX,
  textPositionY,
  onChangeTextPositionY,
  // 新增：从图片推荐配色
  recommendedColors,
  isRecommendingColors,
  onRecommendColorsFromImage,
  onApplyRecommendedColors,
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          🏷️ {t('labelContent')}
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showLabel}
            onChange={(e) => onToggleShowLabel(e.target.checked)}
            className="w-5 h-5 accent-blue-600 rounded"
          />
          <span className="text-sm font-medium text-gray-600">{t('showLabel')}</span>
        </label>
      </div>

      {showLabel && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => onChangeLabelMode('text')}
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                labelMode === 'text'
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              📝 {t('text')}
            </button>
            <button
              onClick={() => onChangeLabelMode('image')}
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                labelMode === 'image'
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              🖼️ {t('image')}
            </button>
          </div>

          {labelMode === 'text' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 {t('labelText')}
                </label>
                <input
                  type="text"
                  value={labelText}
                  onChange={(e) => onChangeLabelText(e.target.value)}
                  placeholder={t('textPlaceholder')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🎨 {t('textColor')}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={labelColor}
                    onChange={(e) => onChangeLabelColor(e.target.value)}
                    className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer shadow-sm"
                  />
                  <input
                    type="text"
                    value={labelColor}
                    onChange={(e) => onChangeLabelColor(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🔤 {t('fontSelection')}
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => onChangeFontFamily(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white transition-colors"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 新增：文字大小与位置控制 */}
              <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
                    📏 {t('textSize')}
                    <span className="text-blue-600 font-semibold">{textSize}%</span>
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="24"
                    value={textSize}
                    onChange={(e) => onChangeTextSize(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 rounded-lg"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{t('smallSize')}</span>
                    <span>{t('largeSize')}</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
                    ↔️ {t('horizontalPosition')}
                    <span className="text-blue-600 font-semibold">{textPositionX}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={textPositionX}
                    onChange={(e) => onChangeTextPositionX(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 rounded-lg"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{t('left')}</span>
                    <span>{t('center')}</span>
                    <span>{t('right')}</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
                    ↕️ {t('verticalPosition')}
                    <span className="text-blue-600 font-semibold">{textPositionY}%</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    value={textPositionY}
                    onChange={(e) => onChangeTextPositionY(Number(e.target.value))}
                    className="w-full accent-blue-600 h-3 rounded-lg"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{t('top')}</span>
                    <span>{t('center')}</span>
                    <span>{t('bottom')}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              {!customImage ? (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                >
                  <Upload className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-3 transition-colors" />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">{t('uploadImage')}</span>
                  <span className="text-xs text-gray-400 mt-1">{t('supportedFormats')}</span>
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={customImage}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg hover:shadow-xl"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {customImage && (
                <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                  {/* 图片遮罩：限制图片在文件夹主体内 */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      🧩 {t('clipImageToBody')}
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={clipImageToBody}
                        onChange={(e) => onToggleClipImageToBody(e.target.checked)}
                        className="w-5 h-5 accent-blue-600 rounded"
                      />
                    </label>
                  </div>

                  {/* 从图片推荐配色 */}
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">🎨 {t('ai.recommendedColors')}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRecommendColorsFromImage}
          disabled={isRecommendingColors}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${isRecommendingColors ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200 border-blue-200'}`}
        >
          <span className="mr-1">🔄</span>{isRecommendingColors ? t('ai.recommending') : t('ai.recommendColors')}
        </button>
      </div>
    </div>

                    {Array.isArray(recommendedColors) && recommendedColors.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {recommendedColors.map((scheme, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white/80 hover:bg-white transition">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-md shadow-sm border border-gray-200" style={{ background: scheme.bodyColor }} title="Body" />
                              <div className="w-8 h-8 rounded-md shadow-sm border border-gray-200" style={{ background: scheme.tabColor || scheme.bodyColor }} title="Tab" />
                            </div>
                            <button
                              type="button"
                              onClick={() => onApplyRecommendedColors && onApplyRecommendedColors(scheme)}
                              className="px-3 py-2 rounded-lg text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                            >
                              {t('ai.applyColors')}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t('imageSize')}
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 min-w-[50px]">{t('smallImageSize')}</span>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        value={imageSize}
                        onChange={(e) => onChangeImageSize(Number(e.target.value))}
                        className="flex-1 accent-blue-600"
                      />
                      <span className="text-sm text-gray-500 min-w-[50px]">{t('largeImageSize')}</span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-sm font-medium text-blue-600">{imageSize}%</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
                      ↔️ {t('horizontalPosition')}
                      <span className="text-blue-600 font-semibold">
                        {typeof imagePositionX === 'number' ? imagePositionX : imagePositionX === 'left' ? 30 : imagePositionX === 'right' ? 70 : 50}%
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={typeof imagePositionX === 'number' ? imagePositionX : imagePositionX === 'left' ? 30 : imagePositionX === 'right' ? 70 : 50}
                      onChange={(e) => onChangeImagePositionX(Number(e.target.value))}
                      className="w-full accent-blue-600 h-2 rounded-lg"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>{t('left')}</span>
                      <span>{t('center')}</span>
                      <span>{t('right')}</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
                      ↕️ {t('verticalPosition')}
                      <span className="text-blue-600 font-semibold">
                        {typeof imagePositionY === 'number' ? imagePositionY : imagePositionY === 'top' ? 40 : imagePositionY === 'bottom' ? 80 : 50}%
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={typeof imagePositionY === 'number' ? imagePositionY : imagePositionY === 'top' ? 40 : imagePositionY === 'bottom' ? 80 : 50}
                      onChange={(e) => onChangeImagePositionY(Number(e.target.value))}
                      className="w-full accent-blue-600 h-2 rounded-lg"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>{t('top')}</span>
                      <span>{t('center')}</span>
                      <span>{t('bottom')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LabelControls;