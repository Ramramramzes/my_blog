import { Stack, Avatar, Typography, Box } from "@mui/material";
import { PostProps } from "../interfaces/posts";
import { formatCustomDate } from "../common/common.ts";

export const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      width="100%"
      padding={2}
      border="1px solid #ddd"
      borderRadius={2}
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.1)"
      mb={1.5}
    >
      <Avatar sx={{ bgcolor: "#1DA1F2" }}>
        {post.username[0].toUpperCase()}
      </Avatar>
      <Box flexGrow={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight="bold">{post.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            {formatCustomDate(post.created_at, 3)} {/* Указываем UTC +3 */}
          </Typography>
        </Stack>
        <Typography mt={1}>{post.content}</Typography>
      </Box>
    </Stack>
  );
};