let utils=(function(){
    let offset=function(ele){
        let left=ele.offsetLeft;
        let top=ele.offsetTop;
        let parent=ele.offsetParent;
        while(parent){
            if(!/MSIE 8/.test(navigator.userAgent)){
                left+=parent.clientLeft;
                top+=parent.clientTop;
            }
            left+=parent.offsetLeft;
            top+=parent.offsetTop;
            parent=parent.offsetParent;
        } 
        return {
            left,
            top
        }
    }
    return {
        offset
    }
})()
let flow=(function(){
    let columns=Array.from(document.querySelectorAll('.columns'));
    let data=[];
    let doc=document.documentElement;
    //
    let getData=function(){
        let xhr=new XMLHttpRequest;
        xhr.open('get','./json/data.json',false);
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4 && xhr.status==200){
                console.log(data);
                data=JSON.parse(xhr.responseText);
            }
        }
        xhr.send(null);
    }
    //
    let render=function(){
        data=data.map(item=>{
            let h=230*item.width/item.height;
            item.width=230;
            item.height=h;
            return item;
        })
        
        for(let i=0;i<data.length;i+=3){
            columns.sort((a,b)=>{
                return b.offsetHeight - a.offsetHeight
            })
            let group=data.slice(i,i+3);
            group.sort((a,b)=>{
                return a.height - b.height
            })
            group.forEach((item,index)=>{
                let {
                    pic,
                    link,
                    title,
                    height
                }=item;
                let card=document.createElement('div');
                card.className='card';
                card.innerHTML=`<a href="${link}" class="link">
                    <div class="imgBox" style="height:${height}px">
                        <img src="" alt="" data-img="${pic}">
                    </div>
                    <p class="title">${title}</p>
                </a>`
                columns[index].appendChild(card);
            })
        }
    }
    //
    let lazy=function(){
        let lazyImg=document.querySelectorAll('img');
        [].forEach.call(lazyImg,item=>{
            let isLoad=item.getAttribute('isLoad');
            if(isLoad) return;
            let imgSrc=item.getAttribute('data-img');
            let imgH=utils.offset(item).top;
            let tempH=doc.clientHeight+doc.scrollTop;
            if(imgH<=tempH){
                item.src=imgSrc;
                item.onload=()=>{
                    item['style']['opacity']=1;
                }
                item.setAttribute('isLoad','true');
            }
        })
    }
    //
    let isRender;
    let loadMore=function(){
        let h1=doc.clientHeight*1.5+doc.scrollTop;
        let h2=doc.scrollHeight;
        if(h1>=h2){
            if(isRender) return ;
            isRender=true;
            getData();
            render();
            lazy();
            isRender=false;
        }
        
    }
    //
    return {
        init(){
            getData();
            render();
            lazy();
            window.onscroll=function(){
                loadMore();
                lazy();
            }
        }
    }
})()
flow.init();