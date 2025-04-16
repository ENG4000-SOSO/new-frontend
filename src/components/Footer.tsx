import { Box, Flex, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { useTheme } from '@context/theme/theme_context';

const Footer: React.FC = () => {

  const { theme } = useTheme();

  return (
    <Box
      backgroundColor={theme === "light" ? "teal.100" : "teal.900"}
      minHeight={200}
      padding={10}
    >
      <Flex justifyContent="space-between">
        <Box>
          <Text textStyle="4xl" fontWeight="bold">
            Satellite Operations Services Optimizer
          </Text>
          <Text textStyle="lg" fontWeight="semibold">
            York University &copy; 2025
          </Text>
        </Box>
        <Box>
          {[
            { name: "Daniel Di Giovanni", email: "dand02@my.yorku.ca" },
            { name: "Dwumah Anokye", email: "dwumahanokye@gmail.com" },
            { name: "Amir Ibrahim", email: "amir3000@my.yorku.ca" },
            { name: "Jasleen Kaur", email: "jinni30@my.yorku.ca" },
            { name: "Vikramjeet Singh", email: "vsingh69@my.yorku.ca" },
            { name: "Darick Mendes", email: "darickmendes@hotmail.com" },
          ].map((member, index) => (
            <Text key={index} textStyle="sm">
              {member.name} &#8226;{" "}
              <Link
                variant="underline"
                href={`mailto:${member.email}`}
                colorPalette="teal"
              >
                {member.email}
              </Link>
            </Text>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};

export default Footer;
