// set theme color in meta tag
export const setThemeColor = (color) => {
    const MetaTag = document.querySelector('meta[name="theme-color"]');
    const oldColor = MetaTag.getAttribute('content');
    MetaTag.setAttribute('content', color);
    return oldColor;
}

// set theme color to default #fff
export const setThemeColorToDefault = () => {
    setThemeColor('#fff');
}