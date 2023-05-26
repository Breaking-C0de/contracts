// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./BaseInsurancePolicy.sol";

/**
 * @title LifeInsurancePolicy
 * @dev LifeInsurancePolicy is a contract for managing a life insurance policy
 */

contract LifeInsurancePolicy is BaseInsurancePolicy {
    /**
     * @dev LifeAssuredDetails is a structure for storing the details of the life assured
     *
     */
    struct LifeAssuredDetails {
        string _name;
        string _gender;
        string _dateOfBirth;
        string _homeAddress;
        string _phoneNumber;
        string _pronouns;
        string _email;
        string _occupation;
        address payable _walletAddress;
    }

    uint256 private _maturityCoverage;

    struct Nominee {
        string _name;
        string _gender;
        string _dateOfBirth;
        string _homeAddress;
        string _phoneNumber;
        string _pronouns;
        string _email;
        string _occupation;
        address payable _walletAddress;
        uint128 _nomineeShare;
    }

    Nominees[] private _nominees;

    constructor(
        string memory _policyHolderName,
        string memory _policyHolderGender,
        string memory _policyHolderDateOfBirth,
        string memory _policyHolderHomeAddress,
        string memory _policyHolderPhoneNumber,
        string memory _policyHolderPronouns,
        string memory _policyHolderEmail,
        string memory _policyHolderOccupation,
        address payable _policyHolderWalletAddress,
        uint128 _polilcyTenure,
        uint128 _gracePeriod,
        uint128 _timeBeforeCommencement,
        uint128 _timeInterval,
        uint256 _premiumToBePaid,
        uint256 _totalCoverageByPolicy,
        string memory _lifeAssuredName,
        string memory _lifeAssuredGender,
        string memory _lifeAssuredDateOfBirth,
        string memory _lifeAssuredHomeAddress,
        string memory _lifeAssuredPhoneNumber,
        string memory _lifeAssuredPronouns,
        string memory _lifeAssuredEmail,
        string memory _lifeAssuredOccupation,
        address payable _lifeAssuredWalletAddress,
        uint256 _maturityCoverage,
        string[] memory _nomineeNames,
        string[] memory _nomineeGenders,
        string[] memory _nomineeDateOfBirths,
        string[] memory _nomineeHomeAddresses,
        string[] memory _nomineePhoneNumbers,
        string[] memory _nomineePronouns,
        string[] memory _nomineeEmails,
        string[] memory _nomineeOccupations,
        address payable[] memory _nomineeWalletAddresses,
        uint128[] memory _nomineeShares
    ) {
        BaseInsurancePolicy(
            _policyHolderName,
            _policyHolderGender,
            _policyHolderDateOfBirth,
            _policyHolderHomeAddress,
            _policyHolderPhoneNumber,
            _policyHolderPronouns,
            _policyHolderEmail,
            _policyHolderOccupation,
            _policyHolderWalletAddress,
            _polilcyTenure,
            _gracePeriod,
            _timeBeforeCommencement,
            _timeInterval,
            _premiumToBePaid,
            _totalCoverageByPolicy,
            _lifeAssuredName,
            _lifeAssuredGender,
            _lifeAssuredDateOfBirth,
            _lifeAssuredHomeAddress,
            _lifeAssuredPhoneNumber,
            _lifeAssuredPronouns,
            _lifeAssuredEmail,
            _lifeAssuredOccupation,
            _lifeAssuredWalletAddress,
            _maturityCoverage
        );

        _maturityCoverage = _maturityCoverage;

        LifeAssuredDetails memory _lifeAssuredDetails = LifeAssuredDetails(
            _lifeAssuredName,
            _lifeAssuredGender,
            _lifeAssuredDateOfBirth,
            _lifeAssuredHomeAddress,
            _lifeAssuredPhoneNumber,
            _lifeAssuredPronouns,
            _lifeAssuredEmail,
            _lifeAssuredOccupation,
            _lifeAssuredWalletAddress
        );

        _lifeAssured = _lifeAssuredDetails;

        for (uint256 i = 0; i < _nomineeNames.length; i++) {
            Nominee memory _nominee = Nominee(
                _nomineeNames[i],
                _nomineeGenders[i],
                _nomineeDateOfBirths[i],
                _nomineeHomeAddresses[i],
                _nomineeWalletAddresses[i],
                _nomineePronouns[i],
                _nomineeEmails[i],
                _nomineeWalletAddresses[i],
                _nomineeOccupations[i],
                _nomineeShares[i]
            );

            _nominees.push(_nominee);
        }
    }

    function getMaturityCoverage() public view returns (uint256) {
        return _maturityCoverage;
    }

    function getAllNomineesDetails() public view returns (Nominee[] memory) {
        return _nominees;
    }
}
