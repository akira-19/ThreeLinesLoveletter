const { balance, BN, constants, ether, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
var chai = require('chai');
var should = require('chai').should();
const LoveletterContract = artifacts.require("ThreeLinesLoveletter");


contract("ThreeLinesLoveletter", function(accounts){

    const fLine = "first line";
    const sLine = "second line";
    const tLine = "third line";
    const from = "from";
    const to = "to";
    const date = "2019.05.13";
    const passphrase = "pass phrase";
    const zeroString = "";


    describe('createLetter', async function () {
        beforeEach(async function () {
          this.loveletterInstance = await LoveletterContract.new();
        });
        context('deployed with empty string', async function () {
            it('requires a non-zero first line', async function () {
              await shouldFail.reverting(
                  this.loveletterInstance.createLetter(zeroString, sLine, tLine, from, to, date, passphrase)
              );
            });

            it('requires a non-zero second line', async function () {
              await shouldFail.reverting(
                  this.loveletterInstance.createLetter(fLine, zeroString, tLine, from, to, date, passphrase)
              );
            });

            it('requires a non-zero third line', async function () {
              await shouldFail.reverting(
                  this.loveletterInstance.createLetter(fLine, sLine, zeroString, from, to, date, passphrase)
              );
            });

            it('requires a non-zero from', async function () {
              await shouldFail.reverting(
                  this.loveletterInstance.createLetter(fLine, sLine, tLine, zeroString, to, date, passphrase)
              );
            });

            it('requires a non-zero to', async function () {
              await shouldFail.reverting(
                  this.loveletterInstance.createLetter(fLine, sLine, tLine, from, zeroString, date, passphrase)
              );
            });

            it('requires a non-zero date', async function () {
              await shouldFail.reverting(
                  this.loveletterInstance.createLetter(fLine, sLine, tLine, from, to, zeroString, passphrase)
              );
            });

            it('requires a non-zero passphrase', async function () {
              await shouldFail.reverting(
                  this.loveletterInstance.createLetter(fLine, sLine, tLine, from, to, date, zeroString)
              );
            });

        });

        it('should not have existent letter with the same from and passphrase', async function () {
          await this.loveletterInstance.createLetter(fLine, sLine, tLine, from, to, date, passphrase);
          await shouldFail.reverting(
              this.loveletterInstance.createLetter("wrong fLine", "wrong sLine", "wrong tLine", from, "wrong to", "wrong date", passphrase)
          );
        });

    });


    describe('createLetter', async function () {
        beforeEach(async function () {
          this.loveletterInstance = await LoveletterContract.new();
          await this.loveletterInstance.createLetter(fLine, sLine, tLine, from, to, date, passphrase);
        });

        it('should return the correct string', async function () {
            const letter = await this.loveletterInstance.showLetter(from, passphrase);
            letter[0].should.be.equal(fLine);
        });

        it('should return empty when from is wrong', async function () {
            const letter = await this.loveletterInstance.showLetter("wrong from", passphrase);
            letter[0].should.be.equal("");
        });

        it('should revert when passphrase is wrong', async function () {
            const letter = await this.loveletterInstance.showLetter(from, "wrong passphrase");
            letter[0].should.be.equal("");
        });


    });






});
