/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import { SearchIcon } from './icons';
import type { Template } from '../types';


// New component to handle fetching and displaying template image
const TemplateCard: React.FC<{
  template: Template;
  onSelect: (template: Template) => void;
}> = ({ template, onSelect }) => {
  return (
    <div
      className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 hover:-translate-y-1"
      onClick={() => onSelect(template)}
    >
      <div className="cursor-pointer">
        <div className="aspect-video bg-gray-900 overflow-hidden">
          <img src={template.iconUrl} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-white truncate">{template.name}</h3>
          <p className="text-gray-400 mt-2 text-sm h-20 overflow-hidden text-ellipsis">
            {template.prompt}
          </p>
        </div>
      </div>
    </div>
  );
};

interface TemplateLibraryPageProps {
    onTemplateSelect: (template: Template) => void;
    templates: Template[];
}

const ITEMS_PER_PAGE = 9;

const TemplateLibraryPage: React.FC<TemplateLibraryPageProps> = ({ onTemplateSelect, templates }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Reset page to 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Filtering logic
    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic based on filtered results
    const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentTemplates = filteredTemplates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="font-['Caveat'] text-5xl md:text-7xl font-bold text-white tracking-wider">free-image 模板库</h2>
                <p className="text-gray-300 text-lg md:text-xl mt-2">提示词模板库</p>
            </div>
            
            {/* Search Bar */}
            <div className="mb-8 w-full max-w-2xl mx-auto">
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="搜索模板名称或提示词..."
                        className="block w-full rounded-lg border-gray-600 bg-gray-900/50 py-3 pl-11 pr-4 text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentTemplates.length > 0 ? (
                    currentTemplates.map(template => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onSelect={onTemplateSelect}
                        />
                    ))
                ) : (
                     <div className="col-span-full text-center py-16">
                        <p className="text-gray-400 text-lg">找不到匹配 “<span className="font-semibold text-white">{searchQuery}</span>” 的模板。</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 transition-colors hover:bg-gray-600"
                    >
                        上一页
                    </button>
                    <span className="text-gray-300">
                        第 {currentPage} 页 / 共 {totalPages} 页
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 transition-colors hover:bg-gray-600"
                    >
                        下一页
                    </button>
                </div>
            )}
        </div>
    );
};

export default TemplateLibraryPage;