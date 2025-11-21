module.exports = {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
	addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-actions', '@storybook/addon-docs'],
	framework: {
		name: '@storybook/react-vite',
	},
	docs: {
		autodocs: true,
	},
};
