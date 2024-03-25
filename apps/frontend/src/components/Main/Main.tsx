import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Box, Button, Link, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { DataType } from "../Types/DataTypes";
import { createProfitDataColumns } from "./MainGridColumns";

export function Main() {
    const [data, setData] = useState<DataType | null>(null);

    const [tab, setTab] = useState<string | null>(null);
    const [keys, setKeys] = useState<string[]>([]);
    const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };
    console.log(data, tab, keys);
    useEffect(() => {
        if (!data && !tab) {
            fetch("http://127.0.0.1:3000/api/data")
                .then((res) => res.json())
                .then((data) => {
                    setData(data);
                    setKeys(Object.keys(data));
                    setTab(Object.keys(data)[0]);
                });
        }
    }, [data, tab]);

    const profitDataColumns = createProfitDataColumns();

    return (
        <Box sx={{ width: "100%", height: "100vh", mt: 2 }}>
            <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                mb={2}
            >
                <Button component={Link} href="/settings">
                    settings
                </Button>
            </Box>

            {data && tab && (
                <>
                    <TabContext value={tab}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList
                                onChange={handleChangeTab}
                                aria-label="Table profit info"
                            >
                                {keys.map((el) => {
                                    return <Tab label={el} value={el} />;
                                })}
                            </TabList>
                        </Box>
                    </TabContext>
                    <DataGrid
                        sx={{ minHeight: "82vh" }}
                        getRowId={(row) => row.id}
                        columnVisibilityModel={{
                            profitPerTradeInChaos:
                                "profitPerTradeInChaos" in
                                Object.values(data[tab])[0]
                                    ? true
                                    : false,
                            stackSize:
                                "stackSize" in Object.values(data[tab])[0]
                                    ? true
                                    : false,
                            profitPerTradeInDivine:
                                "profitPerTradeInDivine" in
                                Object.values(data[tab])[0]
                                    ? true
                                    : false,
                        }}
                        initialState={{
                            sorting: {
                                sortModel: [
                                    {
                                        field: "profitInChaos",
                                        sort: "desc",
                                    },
                                ],
                            },
                        }}
                        rows={Object.values(data[tab])}
                        columns={profitDataColumns}
                        disableRowSelectionOnClick
                        // autoHeight
                        density="compact"
                        hideFooter
                    />
                </>
            )}
        </Box>
    );
}
