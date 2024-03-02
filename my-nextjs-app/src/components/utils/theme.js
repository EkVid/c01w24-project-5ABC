const initTheme = () => {
<<<<<<< HEAD
<<<<<<< HEAD
    if (typeof window === "undefined") return;
=======
    console.log('hi')
>>>>>>> fae0b24 (Font Size and Theme settings implemented)
=======
    if (typeof window === "undefined") return;
>>>>>>> 972d39f (moved routers and removed warnings in inspect console)
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

const changeTheme = (checked, setLightTheme) => {
<<<<<<< HEAD
<<<<<<< HEAD
    if (typeof window === "undefined") return;
=======
>>>>>>> fae0b24 (Font Size and Theme settings implemented)
=======
    if (typeof window === "undefined") return;
>>>>>>> 972d39f (moved routers and removed warnings in inspect console)
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
<<<<<<< HEAD
=======
>>>>>>> 972d39f (moved routers and removed warnings in inspect console)
const getTheme = () => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme');
    return 'dark';
}
<<<<<<< HEAD
=======
const getTheme = () => localStorage.getItem('theme')
>>>>>>> fae0b24 (Font Size and Theme settings implemented)
=======
>>>>>>> 972d39f (moved routers and removed warnings in inspect console)

export { initTheme, changeTheme, getTheme }