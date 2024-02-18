const initTheme = () => {
<<<<<<< HEAD
    if (typeof window === "undefined") return;
=======
    console.log('hi')
>>>>>>> fae0b24 (Font Size and Theme settings implemented)
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

const changeTheme = (checked, setLightTheme) => {
<<<<<<< HEAD
    if (typeof window === "undefined") return;
=======
>>>>>>> fae0b24 (Font Size and Theme settings implemented)
    if (checked){
        localStorage.theme = 'light'
        setLightTheme(true)
    }
    else{
        localStorage.theme = 'dark'
        setLightTheme(false)
    }
}

<<<<<<< HEAD
const getTheme = () => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme');
    return 'dark';
}
=======
const getTheme = () => localStorage.getItem('theme')
>>>>>>> fae0b24 (Font Size and Theme settings implemented)

export { initTheme, changeTheme, getTheme };
