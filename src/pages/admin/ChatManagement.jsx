import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar, Skeleton, Stack } from "@mui/material";
import AvatarCard from "../../components/shared/AvatarCard";
import { tranformImage } from "../../libs/features";
import { useFetchData } from "6pp";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/Hooks";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },

  {
    field: "groupChat",
    headerName: "Group-Chat",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard max={100} avatar={params.row.members} />
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => {
      return (
        <Stack direction="row" alignItems="center" spacing={"1rem"}>
          <Avatar
            alt={params.row.creator.name}
            src={params.row.creator.avatar}
          />
          <span>{params.row.creator.name}</span>
        </Stack>
      );
    },
  },
];

const ChatManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/chats`,
    "dashboard-chats"
  );
  useErrors([{ isError: error, error: error }]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(
        data.chats.map((i) => ({
          ...i,
          id: i._id,
          avatar: i.avatar.map((i) => tranformImage(i, 50)),
          members: i.members.map((i) => tranformImage(i.avatar, 50)),
          creator: {
            name: i.creator.name,
            avatar: tranformImage(i.creator.avatar, 50),
          },
        }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table heading={"All Chats"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default ChatManagement;
