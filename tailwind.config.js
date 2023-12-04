module.exports = {
    content: [
        './src/pages/**/*.tsx',
        './src/components/**/*.tsx',
        './src/layouts/**/*.tsx',
    ],
    corePlugins: {
        preflight: false, // 防止tailwindcss 和 ant 样式冲突
    },
}