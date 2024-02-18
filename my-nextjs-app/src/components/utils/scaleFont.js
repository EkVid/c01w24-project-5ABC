const scaleFont = (dir) => {
    const MIN_REL_FONTSIZE = 50
    const MAX_REL_FONTSIZE = 200

    const root = document.getElementById("root");
    const fs = root.style.fontSize

    // Initialize
    if (fs === ''){
        root.style.fontSize = "100%"
    }

    const currFontSize = parseInt(root.style.fontSize);

    switch(dir){
        // Increase font size
        case 'up':
            if(currFontSize < MAX_REL_FONTSIZE){
                root.style.fontSize = `${currFontSize + 10}%`;
            }
            break;
        // Decrease font size
        case 'down':
            if(currFontSize > MIN_REL_FONTSIZE){
                root.style.fontSize = `${currFontSize - 10}%`;
            }
            break;
    }
}

<<<<<<< HEAD
const getFont = () => parseInt(root.style.fontSize);

=======
>>>>>>> fae0b24 (Font Size and Theme settings implemented)
const resetFont = () => {
    document.getElementById("root").style.fontSize = "100%"
}

<<<<<<< HEAD
export { scaleFont, getFont, resetFont }
=======
export { scaleFont, resetFont }
>>>>>>> fae0b24 (Font Size and Theme settings implemented)
