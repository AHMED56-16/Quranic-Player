let audio = document.querySelector(".quranPlayer")
let surahsContainer = document.querySelector(".surahs")
let ayah = document.querySelector(".ayah")
let next = document.querySelector(".next")
let prev = document.querySelector(".prev")
let play = document.querySelector(".play")
getSurahs()
function getSurahs(){
    //Fetch to get data of Surahs
    fetch("https://api.quran.gading.dev/surah")
    .then(response=>response.json())
    .then(data=>{
        for (let surah in data.data){
            surahsContainer.innerHTML+=
            `
                <div>
                    <p>${data.data[surah].name.long}</p>
                    <p>${data.data[surah].name.transliteration.en}</p>
                </div>
            `
        }
        //Select all surahs
        let allSurahs = document.querySelectorAll('.surahs div');
        let ayahsAudio, ayahsText;
        allSurahs.forEach((surah,index)=>{
            surah.addEventListener('click',()=>{
                fetch(`https://api.quran.gading.dev/surah/${index + 1}`)
                .then(response=>response.json())
                .then(data=>{
                    let verses = data.data.verses;
                    ayahsAudio=[];
                    ayahsText=[];
                    verses.forEach(verse=>{
                        ayahsAudio.push(verse.audio.primary);
                        ayahsText.push(verse.text.arab);
                    })
                    let ayahIndex=0;
                    changeAyah(ayahIndex)
                    audio.addEventListener("ended",()=>{
                        ayahIndex++;
                        if(ayahIndex<ayahsAudio.length){
                            changeAyah(ayahIndex)
                        }else{
                            ayahIndex=0;
                            changeAyah(ayahIndex)
                            audio.pause();
                            Swal.fire({
                                position: "center",
                                title: "Surrah has been ended.",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 2000,
                                didOpen: () => {
                                  const swalContainer = document.querySelector('.swal2-container');
                                  swalContainer.style.zIndex = '9999999'; 
                                }
                              });
                              
                            isPlaying=true;
                            togglePlay();
                        }
                    })
                    //Handle next and previous
                    next.addEventListener('click',()=>{
                        ayahIndex<ayahsAudio.length-1?ayahIndex++:ayahIndex=0;
                        changeAyah(ayahIndex)
                    })
                    prev.addEventListener('click',()=>{
                        ayahIndex==0?ayahIndex=ayahsAudio.length-1:ayahIndex--;
                        changeAyah(ayahIndex)
                    })
                    //Play and pause
                    let isPlaying = false;
                    togglePlay();
                    function togglePlay() {
                        if(isPlaying){
                            audio.pause();
                            play.innerHTML=`<i class="fas fa-play"></i>`
                            isPlaying=false;
                        }else{
                            audio.play();
                            play.innerHTML=`<i class="fas fa-pause"></i>`
                            isPlaying=true;
                        }
                    }
                    play.addEventListener('click',togglePlay)
                    function changeAyah(index){
                        audio.src=ayahsAudio[ayahIndex]
                        ayah.innerHTML=ayahsText[ayahIndex]
                    }
                })
            })
        })
    })
}