pragma solidity >=0.4.21 <0.6.0;

contract ThreeLinesLoveletter {

  struct loveletter{
      string firstLine;
      string secondLine;
      string thirdLine;
      string from;
      string to;
      string date;
  }
  mapping (bytes32 => loveletter) loveletters;

  function createLetter(string calldata _fLine, string calldata _sLine, string calldata _tLine, string calldata _from, string calldata _to, string calldata _date, string calldata _passphrase) external   {
      // create password form passphrase and from
      bytes32 password = sha256(abi.encodePacked(_passphrase, _from));

      // check if the letter alraedy exists
      require(stringZeroCheck(loveletters[password].firstLine));

      // arguments have to be not empty
      require(!stringZeroCheck(_fLine));
      require(!stringZeroCheck(_sLine));
      require(!stringZeroCheck(_tLine));
      require(!stringZeroCheck(_from));
      require(!stringZeroCheck(_to));
      require(!stringZeroCheck(_date));
      require(!stringZeroCheck(_passphrase));

      //
      loveletters[password].firstLine = _fLine;
      loveletters[password].secondLine = _sLine;
      loveletters[password].thirdLine = _tLine;
      loveletters[password].from = _from;
      loveletters[password].to = _to;
      loveletters[password].date = _date;
  }

  function showLetter(string calldata _from, string calldata _passphrase) external view returns(string memory, string memory, string memory, string memory, string memory, string memory){
      bytes32 password = sha256(abi.encodePacked(_passphrase, _from));
      return (
          loveletters[password].firstLine,
          loveletters[password].secondLine,
          loveletters[password].thirdLine,
          loveletters[password].from,
          loveletters[password].to,
          loveletters[password].date
          );
  }

  function stringZeroCheck(string memory a)private pure returns (bool) {
      return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((""))));
  }


}
