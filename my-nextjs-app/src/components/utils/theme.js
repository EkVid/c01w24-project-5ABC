const initTheme = () => {
    if (typeof window === "undefined") return;
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

const changeTheme = (checked, setLightTheme) => {
    if (typeof window === "undefined") return;
    if (checked){
        localStorage.theme = 'light'
        setLightTheme(true)
    }
    else{
        localStorage.theme = 'dark'
        setLightTheme(false)
    }
}

const getTheme = () => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme');
    return 'dark';
}

export { initTheme, changeTheme, getTheme }