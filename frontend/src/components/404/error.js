import React, { useState, useEffect } from 'react';
import { Container, VStack, Center, Spinner } from '@chakra-ui/react';

export default function Error() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <Center h="100vh">
            {isLoading ? (
                <Spinner size="xl" style={{ color: '#0056d2' }} />
            ) : (
                <VStack>
                    <Container maxW='550px' color='black' p={4}>
                        <h2 className='text-center'>404</h2>
                        <h3 className='text-center' style={{ color: '#b1b1b1', fontWeight: 400 }}>Sorry, Page not found</h3>
                    </Container>
                </VStack>
            )}
        </Center>
    );
}
