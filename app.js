let table1 = document.getElementById("eventTable");
let table2 = document.getElementById("corr");

let peticion = (url) => {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open("GET", url);
        req.onload = function() {
            if (req.status == 200) {
                resolve(req.response);
            } else {
                reject("error");
            }
        };
        req.send();
    });
};

mcc=(TP,TN,FP,FN)=>{
    return (TP*TN-FP*FN)/(Math.sqrt((TP+FP)*(TP+FN)*(TN+FP)*(TN+FN)));
};

function sortFunction(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}



peticion("https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json").then(event => {
    let eventos = JSON.parse(event);
    let index=0;
    dict={};
    let positivos=0;
    let negativos=0;
    eventos.forEach(ev => {
        table1.innerHTML += `<tr ${ev.squirrel ? "style= 'background-color: #CC9999;'" :""  }>
        <td> ${index += 1} </td>
        <td> ${ev.events} </td>
        <td> ${ev.squirrel} </td>
      </tr>`;
    let lisEvs=ev.events;
    ev.squirrel?positivos+=1:negativos+=1;
    lisEvs.forEach(eve =>{
        if (dict[eve]===undefined){
            
            let a= ev.squirrel?[1,0]:[0,1];
            dict[eve]=a;
        }else{
            let a=dict[eve];
            ev.squirrel?a[0]=a[0]+1:a[1]=a[1]+1;
            dict[eve]=a;
        }

    });
    
    });
    let calc=[];
    
    for (let key in dict){
        let lista=dict[key];
        let TP= lista[0];
        let TN= negativos-lista[1];
        let FN= lista[1];
        let FP= positivos-lista[0];
        let m= mcc(TP,TN,FP,FN);
        
        calc.push([key,m]);
        
    };
    calc.sort(sortFunction);
    let ind=0;
    calc.forEach(elem=>
        table2.innerHTML += `<tr>
        <td> ${ind += 1} </td>
        <td> ${elem[0]} </td>
        <td> ${elem[1]} </td>
      </tr>`
        );

}).catch(error => console.log(error));
