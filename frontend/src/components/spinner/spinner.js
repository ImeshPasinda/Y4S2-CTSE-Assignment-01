import React from 'react';
import { Center, Spinner } from '@chakra-ui/react';

export default function LoadingSpinner() {

    return (
        <Center h="100vh">
            <Spinner size="xl" style={{ color: '#0056d2' }} />
        </Center>
    );
}
