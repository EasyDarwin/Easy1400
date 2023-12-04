module.exports = {
    extends: require.resolve('@umijs/max/eslint'),
    rules: {
        "@typescript-eslint/no-use-before-define": "off", //调用前使用方法，为了ref调用表单妥协
        "prefer-const": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "eqeqeq": "off",
        "no-use-before-define": "off",
        "array-callback-return": "off",
    }
};