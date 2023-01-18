const getElems    = el => document.querySelectorAll(el);
const getElem     = el => document.querySelector(el);

const root        = document.documentElement;
const nav         = getElem('nav');
const settingDesc = getElem('.settings-description');
const objects     = getElems('.object');
const sliders     = getElems('input[type=range]');
const sliderVals  = getElems('.slider-val');
const navShapes   = getElems('.shape-option');


// Settings Hover-Descriptions
const describeSetting = description => {
    settingDesc.innerHTML = description;
    settingDesc.classList.add('active');
}
const removeSettingDesc = () => {
    settingDesc.classList.remove('active');
}

// Copy To Clipboard
const includeTransform = (el, className) => {
    const isScale = el.classList.contains('scale');
    if ((isScale && el.innerHTML === '1') || el.innerHTML === '0')
        return false;
    
    return el.classList.contains(className);
}
const copyToClipboard = () => {
    let tran = '';
    for (let val of sliderVals) {
        if (val.classList.contains('pers')) continue;
        const qty = val.innerHTML;
        tran += (includeTransform(val, 'tran-x')) ? ` translateX(${qty}px)`
              : (includeTransform(val, 'tran-y')) ? ` translateY(${qty}px)`
              : (includeTransform(val, 'tran-z')) ? ` translateZ(${qty}px)`
              : (includeTransform(val,  'rot-x')) ?    ` rotateX(${qty}deg)`
              : (includeTransform(val,  'rot-y')) ?    ` rotateY(${qty}deg)`
              : (includeTransform(val,  'rot-z')) ?    ` rotateZ(${qty}deg)`
              : (includeTransform(val,  'sca-x')) ?     ` scaleX(${qty})`
              : (includeTransform(val,  'sca-y')) ?     ` scaleY(${qty})`
              : (includeTransform(val, 'skew-x')) ?      ` skewX(${qty}deg)`
              : (includeTransform(val, 'skew-y')) ?      ` skewY(${qty}deg)`
              : '';
    }
    if (tran) {
        tran = `-webkit-transform: ${tran};\n` +
               `   -moz-transform: ${tran};\n` +
               `    -ms-transform: ${tran};\n` +
               `     -o-transform: ${tran};\n` +
               `        transform: ${tran};`;
        navigator.clipboard.writeText(tran);
    }
}

// Shape Selection
const cycleShapes = () => {
    let prev = 0;
    let curr = 1;
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].classList.contains('active')) {
            prev = i;
            curr = i + 1;
            if (curr === objects.length) curr = 0;
            break;
        }
    }
    return [prev, curr];
}
const newShape = trigger => {
    const [prev, curr] = cycleShapes();

    objects[prev].classList.remove('active');
    objects[curr].classList.add('active');

    // Only update nav if active
    if (trigger.classList.contains('nav-cycle-btn')) {
        navShapes[prev].classList.remove('active');
        navShapes[curr].classList.add('active');
    }
}
const selectShape = () => {
    nav.style.opacity = 0;
    setTimeout(() => {
        nav.style.display = 'none';
    }, 750);
}

// Theme
const toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
}

// Transforms
const updateSliderVal = (name, val) => {
    el = getElem(`.slider-val.${name}`);
    el.textContent = val;
}
const updateTransform = slider => {
    const name = slider.className;
    const val  = slider.value;

    root.style.setProperty(`--${name}`, val);
    updateSliderVal(name, val);
}
const reset = () => {
    for (let slider of sliders) {
        
        const name = slider.className;
        const val  = (name === 'pers') ? 1000
                   : (name === 'sca-x' || name === 'sca-y') ? 1
                   : 0;
        slider.value = val;
        root.style.setProperty(`--${name}`, val);
        updateSliderVal(name, val);
    }
}