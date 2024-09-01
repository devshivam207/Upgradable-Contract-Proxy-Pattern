import React, { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import {
  Box,
  Button,
  Input,
  Heading,
  Text,
  VStack,
  List,
  ListItem,
  useToast,
  Container,
  useColorModeValue,
  Flex,
  Spacer,
  Badge,
  Divider,
} from "@chakra-ui/react";

// Address of the deployed upgraded contract
const contractAddress = "0x567ca647b6083b9e0db365658f3Ec810087B7D6a";

// Define the ABIs for both old and new contracts
const oldContractABI = [
  "function getValue() view returns (uint256)",
  "function setValue(uint256 _value, address _sender) external",
];

const newContractABI = [
  "function getValue() view returns (uint256)",
  "function setValue(uint256 _value, address _sender) external",
  "function addAdmin(address signer, address newAdmin) external",
  "function removeAdmin(address signer, address admin) external",
  "function transferAdminRole(address signer, address oldAdmin, address newAdmin) external",
  "function renounceAdminRole(address signer) external",
  "function getAdmins() view returns (address[])",
];

const ContractInteraction = () => {
  const [currentValue, setCurrentValue] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState("");
  const [isUpgraded, setIsUpgraded] = useState(false);
  const [newAdminAddress, setNewAdminAddress] = useState("");
  const [oldAdminAddress, setOldAdminAddress] = useState("");
  const [signerAddress, setSignerAddress] = useState("");

  const toast = useToast();

  // Initialize ethers provider and contract instance
  const provider = useMemo(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      return new ethers.providers.Web3Provider(window.ethereum);
    }
    return null;
  }, []);

  const signer = useMemo(() => provider?.getSigner(), [provider]);

  // Initialize contract based on upgrade status
  const contract = useMemo(() => {
    if (!signer) return null;
    return new ethers.Contract(
      contractAddress,
      isUpgraded ? newContractABI : oldContractABI,
      signer
    );
  }, [isUpgraded, signer]);

  // Enhanced color modes
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const accentColor = useColorModeValue("purple.500", "purple.300");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const adminListBg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const initializeComponent = async () => {
      if (!signer || !contract) return;

      try {
        const address = await signer.getAddress();
        setSignerAddress(address);

        const tempContract = new ethers.Contract(
          contractAddress,
          newContractABI,
          signer
        );
        await tempContract.getAdmins();
        setIsUpgraded(true);
      } catch (error) {
        console.error("Error initializing component:", error);
        setMessage(
          "Error initializing component. Please check your connection and try again."
        );
        toast({
          title: "Initialization Error",
          description:
            "Error initializing component. Please check your connection and try again.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    };

    initializeComponent();
  }, [signer, contract, toast]);

  const fetchValue = async () => {
    if (!contract) return;

    try {
      const value = await contract.getValue();
      setCurrentValue(value.toString());
    } catch (error) {
      console.error("Error fetching value:", error);
      setMessage("Error fetching value.");
      toast({
        title: "Fetch Value Error",
        description: "Error fetching value.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const updateValue = async () => {
    if (!contract || !signerAddress) return;

    try {
      const tx = await contract.setValue(
        ethers.utils.parseUnits(newValue, 0),
        signerAddress
      );
      await tx.wait();
      setMessage("Value updated successfully.");
      fetchValue();
      toast({
        title: "Success",
        description: "Value updated successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating value:", error);
      setMessage(`Error updating value: ${error.message}`);
      toast({
        title: "Update Value Error",
        description: `Error updating value: ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const addAdmin = async () => {
    if (!contract || !signerAddress) return;

    try {
      if (!ethers.utils.isAddress(newAdminAddress)) {
        setMessage("Invalid new admin address provided.");
        return;
      }

      const tx = await contract.addAdmin(signerAddress, newAdminAddress);
      await tx.wait();
      setMessage("Admin added successfully.");
      fetchAdmins();
      toast({
        title: "Success",
        description: "Admin added successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding admin:", error);
      setMessage(`Error adding admin: ${error.message}`);
      toast({
        title: "Add Admin Error",
        description: `Error adding admin: ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const removeAdmin = async () => {
    if (!contract || !signerAddress) return;

    try {
      if (!ethers.utils.isAddress(newAdminAddress)) {
        setMessage("Invalid admin address to remove provided.");
        return;
      }

      const tx = await contract.removeAdmin(signerAddress, newAdminAddress);
      await tx.wait();
      setMessage("Admin removed successfully.");
      fetchAdmins();
      toast({
        title: "Success",
        description: "Admin removed successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error removing admin:", error);
      setMessage(`Error removing admin: ${error.message}`);
      toast({
        title: "Remove Admin Error",
        description: `Error removing admin: ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const transferAdminRole = async () => {
    if (!contract || !signerAddress) return;

    try {
      if (!ethers.utils.isAddress(oldAdminAddress)) {
        setMessage("Invalid old admin address provided.");
        return;
      }
      if (!ethers.utils.isAddress(newAdminAddress)) {
        setMessage("Invalid new admin address provided.");
        return;
      }

      const tx = await contract.transferAdminRole(
        signerAddress,
        oldAdminAddress,
        newAdminAddress
      );
      await tx.wait();
      setMessage("Admin role transferred successfully.");
      fetchAdmins();
      toast({
        title: "Success",
        description: "Admin role transferred successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error transferring admin role:", error);
      setMessage(`Error transferring admin role: ${error.message}`);
      toast({
        title: "Transfer Admin Role Error",
        description: `Error transferring admin role: ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const renounceAdminRole = async () => {
    if (!contract || !signerAddress) return;

    try {
      const tx = await contract.renounceAdminRole(signerAddress);
      await tx.wait();
      setMessage("Admin role renounced successfully.");
      fetchAdmins();
      toast({
        title: "Success",
        description: "Admin role renounced successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error renouncing admin role:", error);
      setMessage(`Error renouncing admin role: ${error.message}`);
      toast({
        title: "Renounce Admin Role Error",
        description: `Error renouncing admin role: ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const fetchAdmins = async () => {
    if (!contract) return;

    try {
      const adminList = await contract.getAdmins();
      setAdmins(adminList);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setMessage("Error fetching admins.");
      toast({
        title: "Fetch Admins Error",
        description: "Error fetching admins.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minHeight="100vh" bg={bgColor} py={10}>
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          <Box bg={cardBg} borderRadius="xl" p={6} boxShadow="xl">
            <Heading
              as="h1"
              size="xl"
              mb={6}
              color={accentColor}
              textAlign="center"
            ></Heading>
            <Flex alignItems="center" mb={4}>
              <Text fontWeight="bold" color={textColor}>
                Contract Status:
              </Text>
              <Spacer />
              <Badge
                colorScheme={isUpgraded ? "green" : "red"}
                fontSize="0.8em"
                p={1}
              >
                {isUpgraded ? "Upgraded" : "Not Upgraded"}
              </Badge>
            </Flex>
            <Text fontWeight="bold" color={textColor} mb={4}>
              Your address (signer): {signerAddress}
            </Text>

            <Divider my={6} />

            <VStack spacing={4} align="stretch">
              <Button colorScheme="purple" onClick={fetchValue}>
                Get Current Value
              </Button>
              {currentValue !== null && (
                <Text fontWeight="bold" color={accentColor}>
                  Current Value: {currentValue}
                </Text>
              )}

              <Input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Enter new value"
                bg={inputBg}
              />
              <Button colorScheme="blue" onClick={updateValue}>
                Set New Value
              </Button>
            </VStack>
          </Box>

          {isUpgraded && (
            <Box bg={cardBg} borderRadius="xl" p={6} boxShadow="xl">
              <Heading as="h2" size="lg" mb={6} color={accentColor}>
                Admin Management
              </Heading>
              <VStack spacing={4} align="stretch">
                <Input
                  type="text"
                  placeholder="New admin address"
                  value={newAdminAddress}
                  onChange={(e) => setNewAdminAddress(e.target.value)}
                  bg={inputBg}
                />
                <Button colorScheme="green" onClick={addAdmin}>
                  Add Admin
                </Button>

                <Input
                  type="text"
                  placeholder="Admin address to remove"
                  value={newAdminAddress}
                  onChange={(e) => setNewAdminAddress(e.target.value)}
                  bg={inputBg}
                />
                <Button colorScheme="red" onClick={removeAdmin}>
                  Remove Admin
                </Button>

                <Input
                  type="text"
                  placeholder="Old admin address"
                  value={oldAdminAddress}
                  onChange={(e) => setOldAdminAddress(e.target.value)}
                  bg={inputBg}
                />
                <Input
                  type="text"
                  placeholder="New admin address for transfer"
                  value={newAdminAddress}
                  onChange={(e) => setNewAdminAddress(e.target.value)}
                  bg={inputBg}
                />
                <Button colorScheme="orange" onClick={transferAdminRole}>
                  Transfer Admin Role
                </Button>

                <Button colorScheme="pink" onClick={renounceAdminRole}>
                  Renounce Admin Role
                </Button>
                <Button colorScheme="teal" onClick={fetchAdmins}>
                  Fetch Admins
                </Button>

                {admins.length > 0 && (
                  <List
                    spacing={3}
                    mt={4}
                    bg={adminListBg}
                    p={4}
                    borderRadius="md"
                  >
                    <Heading as="h3" size="md" mb={2} color={accentColor}>
                      Current Admins:
                    </Heading>
                    {admins.map((admin, index) => (
                      <ListItem key={index} color={textColor}>
                        {admin}
                      </ListItem>
                    ))}
                  </List>
                )}
              </VStack>
            </Box>
          )}

          {message && (
            <Box bg={cardBg} borderRadius="xl" p={4} boxShadow="md">
              <Text
                color={message.includes("Error") ? "red.500" : "green.500"}
                fontWeight="bold"
              >
                {message}
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default ContractInteraction;
