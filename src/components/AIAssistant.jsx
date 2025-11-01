import React, { useState, useEffect } from 'react';
import { Sparkles, Key, Loader2, Image } from 'lucide-react';
import aiService from "../utils/aiService.js";
import { useLanguage } from '../hooks/useLanguage.jsx';
 

const AIAssistant = ({ onLabelGenerated, onColorRecommended, onImageLabelGenerated, onImageLabelsGenerated }) => {
  const { t } = useLanguage();
  const [apiConfig, setApiConfig] = useState(aiService.getApiConfig());
  const [description, setDescription] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // 保存API配置
  const handleSaveApiConfig = () => {
    if (apiConfig.apiKey.trim() && apiConfig.baseURL.trim()) {
      aiService.setApiConfig(apiConfig.apiKey.trim(), apiConfig.baseURL.trim(), apiConfig.model.trim());
      alert(t('ai.apiConfigSaved') || 'API配置已保存');
    } else {
      alert(t('ai.apiConfigRequired') || '请填写完整的API配置信息');
    }
  };

  const handleGenerateImageLabels = async () => {
    if (!description.trim()) {
      alert(t('ai.descriptionRequired') || '请输入文件夹描述');
      return;
    }
    
    if (!aiService.hasApiKey()) {
      alert(t('ai.apiConfigRequired') || '请先配置API信息');
      return;
    }
    
    setIsGeneratingImage(true);
    try {
      const imageLabels = await aiService.generateImageLabels(description);
      const list = Array.isArray(imageLabels) ? imageLabels : [imageLabels];
      if (Array.isArray(list) && list.length > 0 && typeof onImageLabelsGenerated === 'function') {
        onImageLabelsGenerated(list);
      }
    } catch (error) {
      console.error('生成图片标签失败:', error);
      alert(`生成失败: ${error.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };





  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200/50 rounded-3xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{t('ai.aiAssistant')}</h3>
          <p className="text-sm text-gray-600">{t('ai.aiDescription')}</p>
        </div>
      </div>

      {/* New API配置设置 */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Key className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">{t('ai.apiConfigTitle') || 'New API配置'}</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t('ai.apiKeyLabel') || 'API密钥'}
            </label>
            <input
              type="password"
              value={apiConfig.apiKey}
              onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
              placeholder={t('ai.apiKeyPlaceholder') || '请输入New API密钥'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t('ai.baseUrlLabel') || '服务器地址'}
            </label>
            <input
              type="url"
              value={apiConfig.baseURL}
              onChange={(e) => setApiConfig({...apiConfig, baseURL: e.target.value})}
              placeholder={t('ai.baseUrlPlaceholder') || 'https://your-newapi-server.com'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t('ai.modelLabel') || '模型名称'}
            </label>
            <input
              type="text"
              value={apiConfig.model}
              onChange={(e) => setApiConfig({...apiConfig, model: e.target.value})}
              placeholder="dall-e-3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleSaveApiConfig}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            {t('ai.saveApiConfig') || '保存配置'}
          </button>
        </div>
      </div>

      {/* 功能区域 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('ai.folderDescription') || '文件夹描述'}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('ai.descriptionPlaceholder') || '请描述文件夹的用途或内容...'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-2">

            <button
              onClick={handleGenerateImageLabels}
              disabled={!description.trim() || isGeneratingImage}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingImage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Image className="w-4 h-4" />
              )}
              {isGeneratingImage ? t('ai.generating') || '生成中...' : t('ai.generateImageLabel') || '图片标签'}
            </button>
          </div>




        </div>
    </div>
  );
};

export default AIAssistant;