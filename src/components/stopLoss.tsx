import { Box, Button, Flex, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import React from 'react';
import theme from '../theme';

interface MainFormProps {
    onSubmit: (data: any) => void;
    isConnected: boolean;
}

const MainForm: React.FC<MainFormProps> = ({ onSubmit, isConnected }) => {
    const [sellToken, setSellToken] = React.useState('');
    const [buyToken, setBuyToken] = React.useState('');
    const [sellAmount, setLimit] = React.useState('');
    const [buyAmount, setBuyAmount] = React.useState('');
    const [isFormValid, setIsFormValid] = React.useState(false);
    const [buttonText, setText] = React.useState('Create Order');

    // Check if all form fields are filled
    const checkFormValidity = () => {
        if (sellToken && buyToken && sellAmount && buyAmount && isConnected) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    };

    // Call checkFormValidity whenever any form field changes
    React.useEffect(() => {
        checkFormValidity();
    }, [sellToken, buyToken, sellAmount, buyAmount]);


    const handleSubmit = () => {
        onSubmit({
            sellToken,
            buyToken,
            sellAmount: sellAmount,
            buyAmount: buyAmount,
        });
        setText('Order Created!');
    };

    return (
        <Box
            rounded={"lg"}
            width="400px"
            p={4}
            borderWidth={2}
            borderRadius={8}
            boxShadow={"lg"}
            borderColor="purple"
            backgroundColor="rgba(255, 255, 255, 0.85)"
        >
            <FormControl id="sellToken" mb={4}>
                <FormLabel textColor={theme.colors.purple_dark} fontFamily={theme.font}>Sell Token</FormLabel>
                <Select bg="rgba(255, 255, 255, 0.85)"
                    textColor={sellToken ? theme.colors.purple_dark : 'gray.400'}
                    focusBorderColor={theme.colors.purple_dark}
                    placeholder="Select sell token"
                    value={sellToken}
                    onChange={(e) => setSellToken(e.target.value)}
                    autoFocus={true}
                    fontFamily={theme.font}
                >
                    {/* Add your token options here */}
                    <option value="0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174">USDC</option>
                    <option value="0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063">DAI</option>
                    <option value="0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619">WETH</option>
                </Select>
            </FormControl>

            <FormControl id="buyToken" mb={4}>
                <FormLabel fontFamily={theme.font} textColor={theme.colors.purple_dark}>Buy Token</FormLabel>
                <Select
                    bg="rgba(255, 255, 255, 0.85)"
                    fontFamily={theme.font}
                    textColor={buyToken ? theme.colors.purple_dark : 'gray.400'}
                    focusBorderColor={theme.colors.purple_dark}
                    placeholder="Select buy token"
                    value={buyToken}
                    onChange={(e) => setBuyToken(e.target.value)}
                >
                    {/* Add your token options here */}
                    <option value="0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174">USDC</option>
                    <option value="0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063">DAI</option>
                    <option value="0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619">WETH</option>
                </Select>
            </FormControl>

            <FormControl id="limit" mb={4}>
                <FormLabel fontFamily={theme.font} textColor={theme.colors.purple_dark}>Sell Amount</FormLabel>
                <Input
                    bg="rgba(255, 255, 255, 0.85)"
                    fontFamily={theme.font}
                    textColor={sellAmount ? theme.colors.purple_dark : 'gray.400'}
                    type="number"
                    focusBorderColor={theme.colors.purple_dark}
                    value={sellAmount}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="Enter the sell amount"
                />
            </FormControl>

            <FormControl id="amount" mb={4}>
                <FormLabel fontFamily={theme.font} textColor={theme.colors.purple_dark}>Buy Amount</FormLabel>
                <Input
                    bg="rgba(255, 255, 255, 0.85)"
                    fontFamily={theme.font}
                    type="number"
                    textColor={buyAmount ? theme.colors.purple_dark : 'gray.400'}
                    focusBorderColor={theme.colors.purple_dark}
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    placeholder="Enter the buy amount"
                />
            </FormControl>

            <Flex justifyContent="center">
                <Button
                    colorScheme="purple"
                    fontFamily={theme.font}
                    color={"white"}
                    backgroundColor={isFormValid ? theme.colors.purple_dark : 'gray'}
                    onClick={handleSubmit}
                    disabled={!isFormValid}>
                    {isFormValid ? buttonText : 'Connect your wallet and fill the form'}
                </Button>
            </Flex>
        </Box >
    );
};

export default MainForm;