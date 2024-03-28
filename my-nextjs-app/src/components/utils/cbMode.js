const initcbMode = () => {
    if (typeof window === "undefined") return;
    const theme = localStorage.getItem('cbMode')
    if(theme) return theme
    return ""
}

const changecbMode = (theme) => {
    localStorage.setItem('cbMode', theme)
}

const getcbMode = (currcbMode) => {
    //This returns a list of booleans for easier dynamic styling using ternary operators
    const protanopia = "protanopia" === currcbMode
    const deuteranopia = "deuteranopia" === currcbMode
    const tritanopia = "tritanopia" === currcbMode
    const monochrome = "monochrome" === currcbMode

    return { protanopia, deuteranopia, tritanopia, monochrome }
}

export { initcbMode, changecbMode, getcbMode }