let shopChoose=(function(){
    //
    let navList=document.querySelectorAll('.nav-item');
    let productBox=document.querySelector('.productBox');
    let data=null;
    //
    let queryData=function queryData(){
        let xhr=new XMLHttpRequest();
        xhr.open('get','./json/product.json',false);
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4 && xhr.status==200){
                data=JSON.parse(xhr.response);
            }
        }
        xhr.send(null);
    }
    //
    let render=function render(){
        let str=``;
        data.forEach(item => {
            let {
                title,
                price,
                time,
                hot,
                img
            }=item;
            str+=`<li class="card">
            <img src="${img}" alt="" class="img-top">
            <p class="card-text">${title}</p>
            <p class="card-text">${price}</p>
            <p class="card-text">${time}</p>
            <p class="card-text">${hot}</p>
        </li>`
        });
        productBox.innerHTML=str;
    }
    //
    let clear=function clear(){
        Array.from(navList).forEach(item=>{
            if(item.flag!==this.flag){
                item.flag=-1;
            }
        })
    }
    let handle=function handle(){
        [].forEach.call(navList,item=>{
            item.flag=-1;
            item.onclick=function(){
                clear.call(this);
                this.flag*=-1;
                let pai=this.getAttribute('data-pai');
                data=data.sort((a,b)=>{
                    a=String(a[pai]).replace(/-/g,'');
                    b=String(b[pai]).replace(/-/g,'');
                    return (a-b)*this.flag
                });
                render();
            }
        })
    }
    //
    return {
        init(){
            queryData();
            render();
            handle();
        }
    }
})();
shopChoose.init();