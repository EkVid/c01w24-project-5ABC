const initcbMode = () => {
    if (typeof window === "undefined") return;
    const theme = localStorage.getItem('cbMode')
    if(theme) return theme
    return ""
}

const changecbMode = (theme) => {
    localStorage.setItem('cbMode', theme)
}

export { initcbMode, changecbMode }