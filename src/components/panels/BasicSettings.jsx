import React from 'react';

const BasicSettings = ({ showHighlight, onToggleHighlight }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200/50">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={showHighlight}
          onChange={(e) => onToggleHighlight(e.target.checked)}
          className="w-5 h-5 accent-blue-600 rounded"
        />
        <span className="text-sm font-semibold text-gray-700">✨ 显示高光效果</span>
      </label>
    </div>
  );
};

export default BasicSettings;