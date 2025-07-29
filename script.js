// ============================================
// 전역 변수 및 초기화
// ============================================

let currentTab = 'paint-tab';
let isDrawing = false;
let isErasing = false;
let originalImageData = null;

// ============================================
// 탭 전환 기능
// ============================================

function openTab(evt, tabName) {
    // 모든 탭 내용 숨기기
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // 모든 탭 버튼 비활성화
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    // 선택된 탭 활성화
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
    
    currentTab = tabName;
}

// ============================================
// 그림판 기능 구현
// ============================================

function initPaintApp() {
    const canvas = document.getElementById('paint-canvas');
    const ctx = canvas.getContext('2d');
    const colorInput = document.getElementById('brush-color');
    const sizeInput = document.getElementById('brush-size');
    const sizeDisplay = document.getElementById('size-display');
    const eraserBtn = document.getElementById('eraser-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // 캔버스 배경을 흰색으로 설정
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 브러시 크기 표시 업데이트
    sizeInput.addEventListener('input', () => {
        sizeDisplay.textContent = sizeInput.value + 'px';
    });
    
    // 지우개 모드 토글
    eraserBtn.addEventListener('click', () => {
        isErasing = !isErasing;
        eraserBtn.classList.toggle('active');
        eraserBtn.textContent = isErasing ? '🖌️ 브러시' : '🧹 지우개';
    });
    
    // 전체 지우기
    clearBtn.addEventListener('click', () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    
    // 그리기 시작
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
    });
    
    // 그리기 중
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineWidth = sizeInput.value;
        ctx.lineCap = 'round';
        
        if (isErasing) {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = colorInput.value;
        }
        
        ctx.lineTo(x, y);
        ctx.stroke();
    });
    
    // 그리기 종료
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });
    
    // 마우스가 캔버스를 벗어날 때
    canvas.addEventListener('mouseout', () => {
        isDrawing = false;
    });
}

// ============================================
// 데이터 시각화 기능 구현
// ============================================

function initChartApp() {
    const canvas = document.getElementById('chart-canvas');
    const ctx = canvas.getContext('2d');
    const barChartBtn = document.getElementById('bar-chart-btn');
    const lineChartBtn = document.getElementById('line-chart-btn');
    const clearChartBtn = document.getElementById('clear-chart-btn');
    
    // 샘플 데이터
    const sampleData = {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
        values: [30, 45, 28, 60, 35, 50]
    };
    
    // 캔버스 초기화
    function clearCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // 막대 그래프 그리기
    function drawBarChart() {
        clearCanvas();
        
        const margin = 60;
        const chartWidth = canvas.width - (margin * 2);
        const chartHeight = canvas.height - (margin * 2);
        const barWidth = chartWidth / sampleData.values.length;
        const maxValue = Math.max(...sampleData.values);
        
        // 축 그리기
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, canvas.height - margin);
        ctx.lineTo(canvas.width - margin, canvas.height - margin);
        ctx.stroke();
        
        // 막대 그리기
        sampleData.values.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = margin + (index * barWidth) + (barWidth * 0.1);
            const y = canvas.height - margin - barHeight;
            const width = barWidth * 0.8;
            
            // 막대 색상 (그라데이션)
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#4facfe');
            gradient.addColorStop(1, '#00f2fe');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, width, barHeight);
            
            // 값 표시
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + width/2, y - 10);
            
            // 라벨 표시
            ctx.fillText(sampleData.labels[index], x + width/2, canvas.height - margin + 20);
        });
        
        // 제목
        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('월별 판매량 (막대 그래프)', canvas.width/2, 30);
    }
    
    // 선 그래프 그리기
    function drawLineChart() {
        clearCanvas();
        
        const margin = 60;
        const chartWidth = canvas.width - (margin * 2);
        const chartHeight = canvas.height - (margin * 2);
        const stepX = chartWidth / (sampleData.values.length - 1);
        const maxValue = Math.max(...sampleData.values);
        
        // 축 그리기
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, canvas.height - margin);
        ctx.lineTo(canvas.width - margin, canvas.height - margin);
        ctx.stroke();
        
        // 격자 그리기
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            const y = margin + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(margin, y);
            ctx.lineTo(canvas.width - margin, y);
            ctx.stroke();
        }
        
        // 선 그리기
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        sampleData.values.forEach((value, index) => {
            const x = margin + (index * stepX);
            const y = canvas.height - margin - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // 점 그리기
        sampleData.values.forEach((value, index) => {
            const x = margin + (index * stepX);
            const y = canvas.height - margin - (value / maxValue) * chartHeight;
            
            ctx.fillStyle = '#ff4757';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // 값 표시
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value, x, y - 15);
            
            // 라벨 표시
            ctx.fillText(sampleData.labels[index], x, canvas.height - margin + 20);
        });
        
        // 제목
        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('월별 판매량 (선 그래프)', canvas.width/2, 30);
    }
    
    // 이벤트 리스너
    barChartBtn.addEventListener('click', drawBarChart);
    lineChartBtn.addEventListener('click', drawLineChart);
    clearChartBtn.addEventListener('click', clearCanvas);
    
    // 초기 차트 표시
    drawBarChart();
}

// ============================================
// 이미지 필터 기능 구현
// ============================================

function initFilterApp() {
    const canvas = document.getElementById('filter-canvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('image-upload');
    const uploadBtn = document.getElementById('upload-btn');
    const grayscaleBtn = document.getElementById('grayscale-btn');
    const sepiaBtn = document.getElementById('sepia-btn');
    const originalBtn = document.getElementById('original-btn');
    const brightnessSlider = document.getElementById('brightness');
    const contrastSlider = document.getElementById('contrast');
    const brightnessDisplay = document.getElementById('brightness-display');
    const contrastDisplay = document.getElementById('contrast-display');
    
    let currentImage = null;
    let currentFilter = 'none'; // 현재 적용된 필터 추적
    
    // 슬라이더 값 표시 업데이트
    brightnessSlider.addEventListener('input', () => {
        brightnessDisplay.textContent = brightnessSlider.value + '%';
        if (currentImage) applyAllFilters();
    });
    
    contrastSlider.addEventListener('input', () => {
        contrastDisplay.textContent = contrastSlider.value + '%';
        if (currentImage) applyAllFilters();
    });
    
    // 파일 업로드 버튼 클릭
    uploadBtn.addEventListener('click', () => {
        imageUpload.click();
    });
    
    // 이미지 업로드 처리
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // 캔버스 크기에 맞게 이미지 조정
                const aspectRatio = img.width / img.height;
                let drawWidth = canvas.width;
                let drawHeight = canvas.height;
                
                if (aspectRatio > canvas.width / canvas.height) {
                    drawHeight = canvas.width / aspectRatio;
                } else {
                    drawWidth = canvas.height * aspectRatio;
                }
                
                const offsetX = (canvas.width - drawWidth) / 2;
                const offsetY = (canvas.height - drawHeight) / 2;
                
                // 캔버스 지우기
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // 이미지 그리기
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                
                // 원본 이미지 데이터 저장
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                currentImage = img;
                currentFilter = 'none';
                
                // 슬라이더 초기화
                brightnessSlider.value = 100;
                contrastSlider.value = 100;
                brightnessDisplay.textContent = '100%';
                contrastDisplay.textContent = '100%';
                
                // 버튼 상태 초기화
                updateButtonStates();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
    
    // 모든 필터 적용 (순서: 컬러필터 -> 밝기/대비)
    function applyAllFilters() {
        if (!originalImageData) return;
        
        // 1단계: 원본에서 시작
        let imageData = ctx.createImageData(originalImageData);
        let data = imageData.data;
        const originalData = originalImageData.data;
        
        // 2단계: 컬러 필터 적용 (그레이스케일 또는 세피아)
        if (currentFilter === 'grayscale') {
            for (let i = 0; i < data.length; i += 4) {
                const gray = originalData[i] * 0.299 + originalData[i + 1] * 0.587 + originalData[i + 2] * 0.114;
                data[i] = gray;     // R
                data[i + 1] = gray; // G
                data[i + 2] = gray; // B
                data[i + 3] = originalData[i + 3]; // Alpha
            }
        } else if (currentFilter === 'sepia') {
            for (let i = 0; i < data.length; i += 4) {
                const r = originalData[i];
                const g = originalData[i + 1];
                const b = originalData[i + 2];
                
                data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));     // R
                data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)); // G
                data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131)); // B
                data[i + 3] = originalData[i + 3]; // Alpha
            }
        } else {
            // 원본 복사
            for (let i = 0; i < data.length; i++) {
                data[i] = originalData[i];
            }
        }
        
        // 3단계: 밝기 및 대비 조절
        const brightness = parseInt(brightnessSlider.value);
        const contrast = parseInt(contrastSlider.value);
        
        if (brightness !== 100 || contrast !== 100) {
            const brightnessAdjust = brightness - 100;
            const contrastAdjust = contrast / 100;
            
            for (let i = 0; i < data.length; i += 4) {
                // 밝기 조절
                let r = data[i] + brightnessAdjust;
                let g = data[i + 1] + brightnessAdjust;
                let b = data[i + 2] + brightnessAdjust;
                
                // 대비 조절
                r = ((r - 128) * contrastAdjust) + 128;
                g = ((g - 128) * contrastAdjust) + 128;
                b = ((b - 128) * contrastAdjust) + 128;
                
                // 값 제한 (0-255)
                data[i] = Math.max(0, Math.min(255, r));
                data[i + 1] = Math.max(0, Math.min(255, g));
                data[i + 2] = Math.max(0, Math.min(255, b));
                // Alpha는 그대로 유지
            }
        }
        
        // 4단계: 캔버스에 적용
        ctx.putImageData(imageData, 0, 0);
    }
    
    // 버튼 상태 업데이트
    function updateButtonStates() {
        // 모든 버튼 비활성화
        grayscaleBtn.classList.remove('active');
        sepiaBtn.classList.remove('active');
        originalBtn.classList.remove('active');
        
        // 현재 필터에 맞는 버튼 활성화
        if (currentFilter === 'grayscale') {
            grayscaleBtn.classList.add('active');
        } else if (currentFilter === 'sepia') {
            sepiaBtn.classList.add('active');
        } else {
            originalBtn.classList.add('active');
        }
    }
    
    // 그레이스케일 필터
    function applyGrayscale() {
        if (!originalImageData) return;
        currentFilter = 'grayscale';
        updateButtonStates();
        applyAllFilters();
    }
    
    // 세피아 필터
    function applySepia() {
        if (!originalImageData) return;
        currentFilter = 'sepia';
        updateButtonStates();
        applyAllFilters();
    }
    
    // 원본 복원
    function restoreOriginal() {
        if (!originalImageData) return;
        currentFilter = 'none';
        brightnessSlider.value = 100;
        contrastSlider.value = 100;
        brightnessDisplay.textContent = '100%';
        contrastDisplay.textContent = '100%';
        updateButtonStates();
        applyAllFilters();
    }
    
    // 이벤트 리스너
    grayscaleBtn.addEventListener('click', applyGrayscale);
    sepiaBtn.addEventListener('click', applySepia);
    originalBtn.addEventListener('click', restoreOriginal);
    
    // 기본 이미지 표시 (샘플)
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#6c757d';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📁 이미지를 업로드해주세요', canvas.width/2, canvas.height/2);
}

// ============================================
// 애플리케이션 초기화
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initPaintApp();
    initChartApp();
    initFilterApp();
});

// ============================================
// 터치 이벤트 지원 (모바일)
// ============================================

function addTouchSupport() {
    const paintCanvas = document.getElementById('paint-canvas');
    
    // 터치 시작
    paintCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        paintCanvas.dispatchEvent(mouseEvent);
    });
    
    // 터치 이동
    paintCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        paintCanvas.dispatchEvent(mouseEvent);
    });
    
    // 터치 종료
    paintCanvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        paintCanvas.dispatchEvent(mouseEvent);
    });
}

// 터치 이벤트 추가
addTouchSupport();