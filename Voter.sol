pragma solidity ^0.4.25;


//pragma experimental ABIEncoderV2;

contract Voter {
    uint256[] public votes;
    string[] public options;
    mapping(address => bool) hasVoted;
    struct OptionPos {
        uint256 pos;
        bool exists;
    }
    mapping(string => OptionPos) optionStrInt;
    bool votingStarted;

    function addOption(string memory option) public {
        require((!votingStarted), "error");
        options.push(option);
    }

    function startVoting() public {
        require((!votingStarted), "error");
        //    options = _options;
        votes.length = options.length;
        for (uint256 i = 0; i < options.length; i++) {
            OptionPos memory optionPos = OptionPos(i, true);
            optionStrInt[options[i]] = optionPos;
        }
        votingStarted = true;
    }

    function vote(uint256 option) public {
        require(option >= 0 && option < options.length, "Invalid option!");
        require(!hasVoted[msg.sender], "User already voted!");
        votes[option] = votes[option] + 1;
        hasVoted[msg.sender] = true;
    }

    function vote(string memory option) public {
        require(optionStrInt[option].exists, "Invalid string option!");
        require(!hasVoted[msg.sender], "User already voted!");
        OptionPos memory op = optionStrInt[option];

        votes[op.pos] = votes[op.pos] + 1;
        hasVoted[msg.sender] = true;
    }

    // function getOptions() public view returns (string[] memory) {
    //     return options;
    // }

    function getVotes() public view returns (uint256[] memory) {
        return votes;
    }
}
