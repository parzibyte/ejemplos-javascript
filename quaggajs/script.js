document.addEventListener("DOMContentLoaded", ()=>{
  const $resultados=document.querySelector("#resultados");
    Quagga.init({
        inputStream : {
          name : "Live",
          type : "LiveStream",
          target: document.querySelector('#contenedor')    // Or '#yourElement' (optional)
        },
        decoder : {
          readers : ["ean_reader"]
        }
      }, function(err) {
          if (err) {
              console.log(err);
              return
          }
          console.log("Initialization finished. Ready to start");
          Quagga.start();
      });

      Quagga.onDetected((data)=>{
        $resultados.innerHTML = JSON.stringify(data);
          console.log({data});
      });
});