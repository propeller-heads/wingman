import { Box, Button, Flex, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import React from 'react';

interface MainFormProps {
    onSubmit: (data: any) => void;
    isConnected: boolean;
}

const MainForm: React.FC<MainFormProps> = ({ onSubmit, isConnected }) => {
    const [sellToken, setSellToken] = React.useState('');
    const [buyToken, setBuyToken] = React.useState('');
    const [stopAt, setStopAt] = React.useState('');
    const [limit, setLimit] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [isFormValid, setIsFormValid] = React.useState(false);

    // Check if all form fields are filled
    const checkFormValidity = () => {
        if (sellToken && buyToken && stopAt && limit && amount && isConnected) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    };

    // Call checkFormValidity whenever any form field changes
    React.useEffect(() => {
        checkFormValidity();
    }, [sellToken, buyToken, stopAt, limit, amount]);


    const handleSubmit = () => {
        onSubmit({
            sellToken,
            buyToken,
            stopAt,
            limit,
            amount,
        });
    };

    return (
        <Box width="400px" p={4} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="purple" backgroundColor="rgba(255, 255, 255, 0.85)" // Set the background color to white with 80% opacity
        >
            <FormControl id="sellToken" mb={4}>
                <FormLabel>Sell Token</FormLabel>
                <Select bg="rgba(255, 255, 255, 0.85)"
                    placeholder="Select sell token"
                    value={sellToken}
                    onChange={(e) => setSellToken(e.target.value)}
                >
                    {/* Add your token options here */}
                    <option value="0x0000000000000000000000000000000000001010">MATIC</option>
                    <option value="0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174">USDC</option>
                    <option value="0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063">DAI</option>
                </Select>
            </FormControl>

            <FormControl id="buyToken" mb={4}>
                <FormLabel>Buy Token</FormLabel>
                <Select bg="rgba(255, 255, 255, 0.85)"
                    placeholder="Select buy token"
                    value={buyToken}
                    onChange={(e) => setBuyToken(e.target.value)}
                >
                    {/* Add your token options here */}
                    <option value="0x0000000000000000000000000000000000001010">MATIC</option>
                    <option value="0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174">USDC</option>
                    <option value="0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063">DAI</option>
                </Select>
            </FormControl>

            <FormControl id="stopAt" mb={4}>
                <FormLabel>Stop at</FormLabel>
                <Input bg="rgba(255, 255, 255, 0.85)"
                    type="number"
                    value={stopAt}
                    onChange={(e) => setStopAt(e.target.value)}
                    placeholder="Enter stop at value"
                />
            </FormControl>

            <FormControl id="limit" mb={4}>
                <FormLabel>Limit</FormLabel>
                <Input bg="rgba(255, 255, 255, 0.85)"
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="Enter limit value"
                />
            </FormControl>

            <FormControl id="amount" mb={4}>
                <FormLabel>Amount</FormLabel>
                <Input bg="rgba(255, 255, 255, 0.85)"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                />
            </FormControl>

            <Flex justifyContent="flex-end">
                <Button colorScheme="purple" color={"white"} backgroundColor={isFormValid ? 'rgba(106,39,115, 255)' : 'gray'} onClick={handleSubmit} disabled={!isFormValid}>
                    {isFormValid ? 'Create Stop-loss' : 'Please connect your wallet and fill the form'}
                </Button>
            </Flex>
        </Box>
    );
};

export default MainForm;