// 剧情数据
const storyData = [
    {
        text: "符咒贴在尚念脸上的瞬间，他扭曲的面孔交织着痛苦和不甘，仿佛被烈火灼烧。他嘶吼着正要伸手撕掉符咒，但一切都太迟了。“吸收” 仪式已经完成了。",
        mood: "fire",
        delay: 50
    },
    {
        text: "下一秒，他就像被抽走了所有力气一样，瘫软在石台上。我长舒一口气，以为一切都结束了。然而当我转过身，却看到李福安和赵惠心也以同样的姿势瘫倒在地。",
        mood: "shock",
        delay: 50
    },
    {
        text: "难道，“仪式执行者” 指的不仅仅是坐在石台上的人吗？我顿时感到全身的汗毛都倒竖了起来。<br><br>我意识到，自己可能犯了一个无法挽回的错误。",
        mood: "fear",
        delay: 60
    },
    {
        text: "尚念双目无神，嘴里却传来如同风中残烛般微弱的呢喃：<br><br><span class='whisper'>“下辈子… 我… 福安… 惠心… 幸福的家庭……”</span>",
        mood: "sad",
        delay: 80
    },
    {
        text: "接着，就在一瞬间，他们三个就从我眼前消失了，仿佛从未存在过一般，只留下空荡荡的石台和贡品台。",
        mood: "void",
        delay: 60
    },
    {
        text: "就在我看着这一切，不知所措之时，一个神秘的声音在我脑海中响起：<br><br><span class='highlight' style='font-size: 2em;'>“कामनं प्रकरोहि”</span>",
        mood: "mysterious",
        delay: 100
    },
    {
        text: "不知为何，我竟然听懂了，这是在让我说出一个愿望。菩萨是想说我为他敬献了三个人，要给我赏赐吗？",
        mood: "confusion",
        delay: 50
    },
    {
        text: "我心中充满了悔恨与挣扎，理智告诉我应该为此忏悔，但我却只是不受控制地开了口：<br><br><span class='highlight'>“把弟弟还给我……”</span>",
        mood: "desperate",
        delay: 70
    },
    {
        text: "......自那个可怕的夜晚以来，已经过去了一周。<br><br>顾铭回来了，他毫发无损，恢复如初 —— 或者说，他根本没有任何问题，除了对自己失踪的事情一无所知。",
        mood: "normal",
        delay: 50
    },
    {
        text: "他的状态好得让我有时会恍惚，怀疑这一切是否只是我的一场噩梦，是否只是我记忆错乱。",
        mood: "normal",
        delay: 50
    },
    {
        text: "但每当这种时候，我都会鬼使神差地打开福安家常菜馆的官网，盯着那早已不再更新的 “福安饭” 发呆。<br><br>我知道，我永远也无法原谅自己。无论他们是否成功轮回，无论他们是否拥有了下辈子，这都是我要背负一生的罪孽。",
        mood: "regret",
        delay: 60
    }
];

// DOM 元素引用
const textContainer = document.getElementById('text-display-area');
const storyTextEl = document.getElementById('story-text');
const nextBtn = document.getElementById('next-btn');
const autoPlayBtn = document.getElementById('auto-play-btn');
const endingScreen = document.getElementById('ending-screen');
const restartBtn = document.getElementById('restart-btn');
const volumeSlider = document.getElementById('volume-slider');
const muteBtn = document.getElementById('mute-btn');
const bgm = document.getElementById('bgm');
const sfx = document.getElementById('sfx');
const bgLayer = document.getElementById('background-layer');

// 状态变量
let currentStep = 0;
let isTyping = false;
let autoPlayTimer = null;
let isAutoPlaying = false;
let isMuted = false;

// 初始化
function init() {
    // 绑定事件
    nextBtn.addEventListener('click', handleNextStep);
    autoPlayBtn.addEventListener('click', toggleAutoPlay);
    restartBtn.addEventListener('click', restartGame);
    muteBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', changeVolume);
    
    // 键盘支持
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            handleNextStep();
        }
    });

    // 开始第一段
    showStep(0);
}

// 处理下一步逻辑
function handleNextStep() {
    if (isTyping) {
        // 如果正在打字，点击则立即显示全部文本
        completeTyping();
        return;
    }

    if (currentStep < storyData.length - 1) {
        currentStep++;
        showStep(currentStep);
    } else {
        showEnding();
    }
}

// 显示指定剧情段落
function showStep(index) {
    if (index >= storyData.length) return;

    const data = storyData[index];
    isTyping = true;
    
    // 更新按钮状态
    nextBtn.disabled = true;
    storyTextEl.innerHTML = '';
    storyTextEl.classList.remove('visible');

    // 处理氛围切换
    updateMood(data.mood);
    
    // 播放音效 (占位逻辑)
    // playSound(data.mood);

    // 延迟一点让淡出动画完成
    setTimeout(() => {
        storyTextEl.classList.add('visible');
        typeWriter(data.text, data.delay);
    }, 300);
}

// 打字机效果
let typeInterval;
function typeWriter(htmlText, speed) {
    // 简单的打字机实现：解析HTML标签并逐字显示
    // 为了简化，这里先创建一个隐藏的临时容器来解析HTML结构
    // 实际复杂场景可能需要更精细的HTML解析器
    
    // 只要有HTML标签，直接一次性显示 (避免打断标签) 
    // 或者简单地按字符切分，但这次为了效果，我们采用逐字显示纯文本，HTML标签一次性插入的方式可能比较复杂
    // 简化方案：如果包含标签，直接显示；如果不包含，打字机。
    // 优化方案：使用简单的正则分割标签和文本

    // 这里使用一个较好的打字机模拟：
    let i = 0;
    // 将<br>替换为特殊占位符，避免被打断
    const textWithPlaceholders = htmlText; 
    
    // 为了支持HTML标签的逐字显示，需要较复杂的逻辑。
    // 这里采用简化版：每段话渐入，不逐字。用户体验可能更好。
    // 如果必须打字机：
    
    storyTextEl.innerHTML = htmlText;
    // 重新应用淡入动画
    storyTextEl.style.opacity = 0;
    
    let opacity = 0;
    clearInterval(typeInterval);
    
    // 使用淡入代替打字机，以兼容HTML标签的复杂性
    typeInterval = setInterval(() => {
        opacity += 0.05;
        storyTextEl.style.opacity = opacity;
        if (opacity >= 1) {
            clearInterval(typeInterval);
            finishStep();
        }
    }, speed / 2); // 速度调整
}

function completeTyping() {
    clearInterval(typeInterval);
    storyTextEl.style.opacity = 1;
    finishStep();
}

function finishStep() {
    isTyping = false;
    nextBtn.disabled = false;
    nextBtn.querySelector('span').innerText = '→';

    // 如果是自动播放，设置定时器到下一段
    if (isAutoPlaying && currentStep < storyData.length - 1) {
        clearTimeout(autoPlayTimer);
        // 根据文本长度动态计算阅读时间
        const readTime = storyData[currentStep].text.length * 100 + 2000;
        autoPlayTimer = setTimeout(handleNextStep, readTime);
    } else if (isAutoPlaying && currentStep === storyData.length - 1) {
        // 最后一段结束后调用结局
        autoPlayTimer = setTimeout(showEnding, 3000);
    }
}

// 切换氛围效果
function updateMood(mood) {
    // 重置背景
    bgLayer.style.transition = "all 2s ease";
    
    switch(mood) {
        case 'fire':
            bgLayer.style.background = "radial-gradient(circle at center, #3a0000 0%, #000000 100%)";
            break;
        case 'shock':
            bgLayer.style.background = "radial-gradient(circle at center, #001a33 0%, #000000 100%)";
            break;
        case 'void':
            bgLayer.style.background = "#000000";
            break;
        case 'mysterious':
            bgLayer.style.background = "radial-gradient(circle at center, #1a0033 0%, #000000 100%)";
            break;
        case 'normal':
            bgLayer.style.background = "radial-gradient(circle at center, #333333 0%, #1a1a1a 100%)";
            break;
        case 'regret':
            bgLayer.style.background = "radial-gradient(circle at center, #222222 0%, #000000 100%)";
            break;
        default:
            bgLayer.style.background = "radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)";
    }
}

// 自动播放控制
function toggleAutoPlay() {
    isAutoPlaying = !isAutoPlaying;
    if (isAutoPlaying) {
        autoPlayBtn.innerHTML = '<span class="icon">⏸</span> 暂停播放';
        autoPlayBtn.classList.add('active');
        handleNextStep(); // 立即尝试下一步或继续当前的
    } else {
        autoPlayBtn.innerHTML = '<span class="icon">▶</span> 自动播放';
        autoPlayBtn.classList.remove('active');
        clearTimeout(autoPlayTimer);
    }
}

// 显示结局
function showEnding() {
    isAutoPlaying = false;
    clearTimeout(autoPlayTimer);
    autoPlayBtn.innerHTML = '<span class="icon">▶</span> 自动播放';
    autoPlayBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    
    textContainer.style.display = 'none';
    endingScreen.classList.remove('hidden');
}

// 重新开始
function restartGame() {
    currentStep = 0;
    endingScreen.classList.add('hidden');
    textContainer.style.display = 'flex';
    nextBtn.style.display = 'flex';
    autoPlayBtn.style.display = 'flex';
    
    showStep(0);
}

// 音量控制
function toggleMute() {
    isMuted = !isMuted;
    bgm.muted = isMuted;
    sfx.muted = isMuted;
    muteBtn.innerHTML = isMuted ? '🔇' : '🔊';
}

function changeVolume(e) {
    const val = e.target.value;
    bgm.volume = val;
    sfx.volume = val;
}

// 启动
init();
