import { useState } from "react";
import {
    createStyles,
    Header,
    Container,
    Group,
    Burger,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",  
        backgroundColor: "var(--background-primary-mix)",
        color: "var(--text-color)",
    },

    links: {
        [theme.fn.smallerThan("xs")]: {
            display: "none",
        },
    },

    burger: {
        [theme.fn.largerThan("xs")]: {
            display: "none",
        },
    },

    logo: {
        height: 45,
        width: "auto",
        cursor: "pointer",
    },

    link: {
        color: "var(--text-color)",
        textDecoration: "none",
        padding: "8px 12px",
        borderRadius: "4px",

        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
    },

    linkActive: {
        color: "var(--accent-color)",
        fontWeight: "bold",
    },
}));

interface HeaderSimpleProps {
    links: { link: string; label: string }[];
}

export function HeaderSimple({ links }: HeaderSimpleProps) {
    const [opened, { toggle }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);
    const { classes, cx } = useStyles();

    const items = links.map((link) => (
        <Link
            key={link.label}
            to={link.link}
            className={cx(classes.link, {
                [classes.linkActive]: active === link.link,
            })}
            onClick={(event) => {
                setActive(link.link);
            }}
        >
            {link.label}
        </Link>
    ));

    return (
        <Header height={70} style={{ width: "100%" }}> 
            <Container className={classes.header}>
                <img
                    src={logo}
                    alt="Logo"
                    className={classes.logo}
                    onClick={() => window.location.href = '/'} 
                />
                <Group spacing={5} className={classes.links}>
                    {items}
                </Group>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    className={classes.burger}
                    size="sm"
                />
            </Container>
        </Header>
    );
}
