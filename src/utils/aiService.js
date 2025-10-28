/**
 * AI服务模块 - 处理New API调用
 */

class AIService {
  constructor() {
    this.apiKey = localStorage.getItem('newapi_api_key') || '';
    this.baseURL = localStorage.getItem('newapi_base_url') || '';
    this.model = localStorage.getItem('newapi_model') || 'gpt-3.5-turbo';
  }

  /**
   * 设置API配置
   * @param {string} apiKey - New API密钥
   * @param {string} baseURL - New API服务器地址
   * @param {string} model - 使用的模型名称
   */
  setApiConfig(apiKey, baseURL, model = 'gpt-3.5-turbo') {
    this.apiKey = apiKey;
    this.baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    this.model = model;
    
    localStorage.setItem('newapi_api_key', apiKey);
    localStorage.setItem('newapi_base_url', this.baseURL);
    localStorage.setItem('newapi_model', model);
  }

  /**
   * 设置API密钥（兼容旧接口）
   * @param {string} apiKey - New API密钥
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    localStorage.setItem('newapi_api_key', apiKey);
  }

  /**
   * 获取API密钥
   * @returns {string} API密钥
   */
  getApiKey() {
    return this.apiKey;
  }

  /**
   * 获取API配置
   * @returns {Object} API配置信息
   */
  getApiConfig() {
    return {
      apiKey: this.apiKey,
      baseURL: this.baseURL,
      model: this.model
    };
  }

  /**
   * 检查API配置是否完整
   * @returns {boolean} 是否已设置完整配置
   */
  hasApiKey() {
    return !!this.apiKey && this.apiKey.trim().length > 0 && 
           !!this.baseURL && this.baseURL.trim().length > 0;
  }

  /**
   * 调用New API聊天接口
   * @param {Array} messages - 消息数组
   * @param {Object} options - 可选参数
   * @returns {Promise<string>} API响应内容
   */
  async callChatGPT(messages, options = {}) {
    if (!this.hasApiKey()) {
      throw new Error('请先设置New API密钥和服务器地址');
    }

    const requestBody = {
      model: options.model || this.model,
      messages,
      max_tokens: options.max_tokens || 1000,
      temperature: options.temperature || 0.7,
    };

    try {
      const response = await fetch(`${this.baseURL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`New API请求失败: ${response.status} ${response.statusText}${errorData.error?.message ? ` - ${errorData.error.message}` : ''}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('New API调用失败:', error);
      throw error;
    }
  }



  /**
   * 生成智能配色推荐
   * @param {string} labelText - 标签文字
   * @param {string} description - 文件夹用途描述
   * @param {string} language - 语言偏好
   * @returns {Promise<Array>} 配色方案数组
   */
  async generateColorRecommendations(labelText, description = '', language = 'zh') {
    const isZh = language === 'zh';
    
    const systemPrompt = isZh
      ? '你是一个专业的色彩设计师。根据文件夹标签和用途，推荐3-4个合适的配色方案。每个方案包含主体颜色和标签颜色的十六进制色值。请考虑：1）色彩心理学 2）可读性 3）美观性 4）用途匹配度。返回格式：方案名称|主体色|标签色|简短说明，每行一个方案。'
      : 'You are a professional color designer. Based on folder labels and purposes, recommend 3-4 suitable color schemes. Each scheme includes hex color values for body and label colors. Consider: 1) Color psychology 2) Readability 3) Aesthetics 4) Purpose matching. Format: Scheme Name|Body Color|Label Color|Brief Description, one scheme per line.';

    const userPrompt = isZh
      ? `文件夹标签："${labelText}"${description ? `，用途：${description}` : ''}`
      : `Folder label: "${labelText}"${description ? `, Purpose: ${description}` : ''}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    try {
      const response = await this.callChatGPT(messages, { temperature: 0.7 });
      return response.split('\n')
        .map(line => {
          const parts = line.trim().split('|');
          if (parts.length >= 4) {
            return {
              name: parts[0].trim(),
              bodyColor: parts[1].trim(),
              labelColor: parts[2].trim(),
              description: parts[3].trim()
            };
          }
          return null;
        })
        .filter(scheme => scheme !== null)
        .slice(0, 4); // 最多返回4个方案
    } catch (error) {
      console.error('生成配色方案失败:', error);
      throw error;
    }
  }

  /**
   * 生成图片标签
   * @param {string} description - 文件夹用途描述
   * @param {string} language - 语言偏好 ('zh' | 'en')
   * @returns {Promise<Array>} 图片标签数组，包含图片URL
   */
  async generateImageLabels(description, language = 'zh') {
    if (!this.hasApiKey()) {
      throw new Error('请先设置New API密钥和服务器地址');
    }

    const isZh = language === 'zh';
    
    // 构建图片生成提示词
    const prompt = isZh 
      ? `生成一个适合作为文件夹标签的PNG图标。主题：${description}。要求：背景透明（带alpha通道），不要出现任何边框、框架、矩形或“文件夹”轮廓；仅绘制简洁的图形与清晰文字，居中排版，现代扁平化风格，无阴影、无水印、无背景色。构图为正方形，整体留白适中，可读性强。避免：文件夹形状、外框、边框线、窗口UI、照片背景、彩色背景。`
      : `Generate a PNG icon suitable as a folder label. Theme: ${description}. Requirements: transparent background (with alpha), no borders, frames, rectangles, or folder outlines; only a simple pictogram and clear text, centered, modern flat style, no shadows, no watermark, no background color. Square composition, adequate whitespace, high legibility. Avoid: folder shape, frames, border lines, window UI, photo backgrounds, colored backgrounds.`;

    const requestBody = {
      model: 'gpt-image-1', // 使用GPT-Image-1模型
      prompt: prompt,
      n: 3, // 生成3张图片
      size: '1024x1024', // 使用API支持的尺寸
      quality: 'high' // GPT-Image-1支持的quality值
    };

    try {
      const response = await fetch(`${this.baseURL}/v1/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`图片生成请求失败: ${response.status} ${response.statusText}${errorData.error?.message ? ` - ${errorData.error.message}` : ''}`);
      }

      const data = await response.json();
      
      // 返回图片数据数组（兼容多种返回字段：url 或 base64）
      return (data?.data || []).map((item, index) => {
        const b64 = item?.b64_json || item?.base64 || item?.image_base64;
        const url = item?.url || item?.image_url || item?.uri;
        const resolvedUrl = b64 ? `data:image/png;base64,${b64}` : url;
        return {
          id: `img_${Date.now()}_${index}`,
          url: resolvedUrl || '',
          prompt: prompt,
          description: description,
          size: '1024x1024'
        };
      });
    } catch (error) {
      console.error('图片生成失败:', error);
      throw error;
    }
  }



  /**
   * 批量生成图片标签
   * @param {Array} folderDescriptions - 文件夹描述数组
   * @param {string} language - 语言偏好
   * @returns {Promise<Array>} 批量生成结果
   */
  async batchGenerateImageLabels(folderDescriptions, language = 'zh') {
    const results = [];
    
    for (const description of folderDescriptions) {
      try {
        const imageLabels = await this.generateImageLabels(description, language);
        const colors = await this.generateColorRecommendations(description, description, language);
        
        results.push({
          description,
          imageLabels,
          colors,
          success: true
        });
        
        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        results.push({
          description,
          error: error.message,
          success: false
        });
      }
    }
    
    return results;
  }
}

// 创建单例实例
const aiService = new AIService();

export default aiService;