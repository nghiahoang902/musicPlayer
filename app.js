const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const heading = $('.header h4');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const btnPlay = $('.btn-play');
const btnPause = $('.btn-pause');
const progress = $('.progress');
const btnNext = $('.btn-next');
const btnPrevs = $('.btn-previous');
const btnRandom = $('.shuffle');
const btnRepeat = $('.btn-repeat');
const playlist = $('.playlist');

const PLAYER_STORAGE_KEY = 'PLAY_MUSIC';

const app = {
    songs: [
        {
            name: 'BigCityBoy',
            singer: 'Binz',
            path: './music/Bigcityboi-Binz-Touliver.mp3',
            img: './img/bigcityboi.jpg'
        },
        {
            name: 'Build A Bitch',
            singer: 'Bella Poarch',
            path: './music/Build A Bitch.mp3',
            img: './img/buildabitch.jpg'
        },
        {
            name: 'CuoiThoi',
            singer: 'Masew, Masiu, B Ray, TAP (Việt Nam)',
            path: './music/CuoiThoi-MasewMasiuBRayTAPVietNam-7085648.mp3',
            img: './img/cuoithoi.jpg'
        },
        {
            name: 'DaiThienBong',
            singer: 'Lộ Gia (Lu Ye)',
            path: './music/DaiThienBong-LoGiaLuYe-6889620.mp3',
            img: './img/daithienbong.jpg'
        },
        {
            name: 'DanhMatEm',
            singer: 'BiTỉnh Lung (Jing Long)',
            path: './music/DanhMatEm-TinhLungJingLong-6268395.mp3',
            img: './img/danhmatem.jpg'
        },
        {
            name: 'DapMoCuocTinh',
            singer: 'Đan Nguyên',
            path: './music/DapMoCuocTinh-DanNguyen-2460868.mp3',
            img: './img/dapmocuotinh.jpg'
        },
        {
            name: 'DeVuong',
            singer: 'Đình Dũng, ACV',
            path: './music/DeVuong-DinhDungACV-7121634.mp3',
            img: './img/devuong.jpg'
        },
        {
            name: 'HaruHaru',
            singer: 'BinBIGBANG',
            path: './music/HaruHaru-BIGBANG-6291516.mp3',
            img: './img/haruharu.jpg'
        },
        {
            name: 'SauTimThiepHong',
            singer: 'Huỳnh Nguyễn Công Bằng, Dương Hồng Loan',
            path: './music/SauTimThiepHong-HuynhNguyenCongBangDuongHongLoan-2644533.mp3',
            img: './img/sautimthiephong.jpg'
        },
        {
            name: 'VungLaMeBay',
            singer: 'Dương Hồng Loan',
            path: './music/VungLaMeBay-DuongHongLoan-4796874.mp3',
            img: './img/VUNGLAMEBAY.jpg'
        },
    ],

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(JSON.stringify(localStorage.getItem(PLAYER_STORAGE_KEY) || {})),

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    //function render
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <img id="song-thumb" src="${song.img}" style="width: 40px; border-radius: 50%;">

                <div class="song-body">
                    <h4 class="title">${song.name}</h4>
                    <span class="author">${song.singer}</span>
                </div>

                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                 </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    //function định nghĩa 1 thuộc tính của object 
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    //function handle events
    handleEvent: function() {
        _this = this;

        //Xử lý cd rotate
        cdThumbTime = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbTime.pause();

        //Xử lý scroll playlist
        const cdHeight = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const cdNewHeight = cdHeight - scrollTop;

            cd.style.width = cdNewHeight > 0 ? cdNewHeight + 'px' : 0;
            cd.style.opacity = cdNewHeight / cdHeight;
        }

        //Xử lý khi click btnPlay
        const player = $('.player');
        btnPlay.onclick = function() {
            if(!_this.isPlaying) {
                audio.play();
                cdThumbTime.play();
            }
        }

        btnPause.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
                cdThumbTime.pause();
            }
        }
        // Khi play bài hát
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
        }
        //Khi pause bài hát
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
        }

        //chạy progress khi bài hát đang phát
        audio.ontimeupdate = function() {
            const progressPercent = audio.currentTime / audio.duration * 100;
            if(progressPercent) {
                progress.value = progressPercent;
            }
        }

        //seeking
        progress.oninput = function(e) {
            const seekTime = audio.duration * (e.target.value / 100);
            audio.currentTime = seekTime;
        }

        //Next song
        btnNext.onclick = function() {
            btnNext.classList.add('btn-active');
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.scrollIntoView();
        }

        //Previous song
        btnPrevs.onclick = function() {
            btnPrevs.classList.add('btn-active');
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.previousSong();
            }
            audio.play();
        }

        //Xử lý random song
        btnRandom.onclick = function() {
            // if(!_this.isRandom) {                   //Cách 1
            //     _this.isRandom = true;
            //     btnRandom.classList.add('active');
            // } else {
            //     _this.isRandom = false;
            //     btnRandom.classList.remove('active');
            // }

            _this.isRandom = !_this.isRandom;       //Cách 2
            // _this.setConfig('isRandom', _this.isRandom);
            btnRandom.classList.toggle('active', _this.isRandom); //Tham số thứ 2 trả về kiểu boolean
            btnRepeat.classList.remove('active');
            _this.isRepeat = false;
        }

        //Xử lý khi repeat song
        btnRepeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            // _this.setConfig('isRepeat', _this.isRepeat);
            btnRepeat.classList.toggle('active', _this.isRepeat);
            btnRandom.classList.remove('active');
            _this.isRandom = false;
        }

        //Xử lý tự next khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                btnNext.click();
            }
        }
        
        //lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
                //Xử lý khi click vào song 
                if (songNode && !e.target.closest('.option')) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    cdThumbTime.play();
                    audio.play();
                    console.log(_this.currentIndex)
                }

                //Xử lý khi click vào option song
                if (e.target.closest('.option')) {
                    console.log("abc")
            }
        } 
    },

    //function lấy dữ liệu bài hát hiện tại
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
        this.render();
    },

    //function load config
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    //function next song
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        console.log(this.currentIndex);
    },

    //function previous song
    previousSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
        console.log(this.currentIndex);
    },

    //function randomSong
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)     // nếu newIndex = currentIndex, thì dừng vòng lặp
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        console.log(this.currentIndex);
    },

    //function scroll into view
    scrollIntoView: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView(
                {
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'end'
                }
            )
        },400);
    },

    //function start 
    start: function() {
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        //Lắng nghe/ xử lý các sự kiện (DOM events)
        this.handleEvent();

        //Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong();
        
        //Render playlist 
        this.render();
        
    },
}
app.start();
