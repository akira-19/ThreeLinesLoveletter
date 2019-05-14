App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
      // Modern dapp browsers...
  if (window.ethereum) {
    App.web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    App.web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/5a11ca0a06184e0bb847088a22e3ab78');
  }

  web3 = new Web3(App.web3Provider);
  return App.initContract();
  },

  initContract: function() {
      $.getJSON('ThreeLinesLoveletter.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var LoveletterArtifact = data;
    App.contracts.Loveletter = TruffleContract(LoveletterArtifact);

    // Set the provider for our contract
    App.contracts.Loveletter.setProvider(App.web3Provider);
  });
  return App.changeFormat();
  },

  changeFormat: function(){
      $(document).on('click', '.letterFormat', function(event){
          event.preventDefault();
          const letterId = event.target.id;
          switch (letterId) {
              case "paper1":
                  $("#letter").removeClass();
                  $("#letter").addClass("firstFormat wrapper");
                  break;
              case "paper2":
                  $("#letter").removeClass();
                  $("#letter").addClass("secondFormat wrapper");
                  break;
              case "paper3":
                  $("#letter").removeClass();
                  $("#letter").addClass("thirdFormat wrapper");
                  break;
              case "paper4":
                  $("#letter").removeClass();
                  $("#letter").addClass("forthFormat wrapper");
                  break;
              default:

          }
      });
  },

  createLetter: function(){
      $(document).off('click');
      $(document).on('click', '#sendBtn', function(){
          const fLine = $("#fLine").val();
          const sLine = $("#sLine").val();
          const tLine = $("#tLine").val();
          const from = $("#writer").val();
          const to = $("#sendTo").val();
          const date = $("#date").val();
          let passphrase = $("#passphrase").val();
          passphrase = passphrase.replace(/\s+/g, "");
          App.contracts.Loveletter.deployed().then(instance => {
              instance.createLetter(fLine, sLine, tLine, from, to, date, passphrase);
          }).catch(function(err) {
              console.log(err.message)
          });
      });
  },

  showLetter: function(){
      $(document).on('click.showAletter', "#readLetter",  async function(){
          const from = $("#letterFrom").val();
          let passphrase = $("#passPhrase").val();
          passphrase = passphrase.replace(/\s+/g, "");
          App.contracts.Loveletter.deployed().then(instance => {
              return instance.showLetter(from, passphrase);
          }).then(result => {
              $("#sendToShow").text(result[4]);
              $("#dateShow").text(result[5]);
              $("#fLineShow").text(result[0]);
              $("#sLineShow").text(result[1]);
              $("#tLineShow").text(result[2]);
              $("#writerShow").text(result[3]);
              if(result[0]){
                  $("#getLetter").show();
                  $("#letter").hide();
                  setTimeout(function(){
                      location.href = "#getLetter";
                  }, 300);
              }else{
                  setTimeout(function(){
                      alert("The from or the pass phrase is wrong.");
                  }, 400);
              }
               $(document).off('click.showAletter');
          }).catch(function(err) {
              console.log(err.message)
          });
      });
  },

  showLetterFormat: function(){
      $(document).on('click', function(){
          $("letter").show();
      });
  }


}

$(function() {
  $(window).load(function() {
    App.init();
    $("#getLetter").hide();
  });
});
