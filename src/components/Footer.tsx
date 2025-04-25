// src/components/Footer.tsx
import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { useTheme } from "@context/theme/theme_context";
import React from "react";

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const bg = theme === "light" ? "teal.100" : "teal.900";

  return (
    <Box as="footer" bg={bg} py={10} px={8} width="100%">
      <Flex justify="space-between" flexWrap="wrap">
        <Box mb={{ base: 4, md: 0 }}>
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
            { name: "Dwumah Anokye",     email: "dwumahanokye@gmail.com" },
            { name: "Amir Ibrahim",      email: "amir3000@my.yorku.ca" },
            { name: "Jasleen Kaur",      email: "jinni30@my.yorku.ca" },
            { name: "Vikramjeet Singh",  email: "vsingh69@my.yorku.ca" },
            { name: "Darick Mendes",     email: "darickmendes@hotmail.com" },
          ].map((member, idx) => (
            <Text key={idx} textStyle="sm">
              {member.name} &#8226;{" "}
              <Link variant="underline" href={`mailto:${member.email}`} colorPalette="teal">
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