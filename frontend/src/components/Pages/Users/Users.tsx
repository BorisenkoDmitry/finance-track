import { useEffect, useState, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import {
  changeUserRole,
  RoleGetApi,
  userDeleteApi,
  usersGetApi,
  type UserReq,
  type UserRole,
} from "../../../stores/userSlice";
import { SelectField } from "../../UI/SelectField/SelectField";
import { Button } from "../../UI/Button/Button";
import { Loader } from "../../UI/Loader/Loader";

interface IUsersItem {
  user: UserReq;
  RoleList: {
    id: string;
    name: UserRole;
  }[];
}

const UserItem: FC<IUsersItem> = ({ user, RoleList }) => {
  const dispatch = useAppDispatch();
  const [role, setRole] = useState({
    value: user.roles[0].id,
    label: user.roles[0].name,
  });
  return (
    <li>
      {user.name} {user.surname}: {user.email}
      <SelectField
        list={RoleList.map((x) => {
          return { value: x.id, label: x.name };
        })}
        selected={role}
        onChange={(x) => {
          setRole(x);
        }}
      />
      <Button
        onClick={() => {
          dispatch(
            changeUserRole({ roleID: role.value, userID: user.id })
          ).finally(() => {
            dispatch(usersGetApi());
          });
        }}
      >
        save role
      </Button>
      <Button
        theme="red"
        onClick={() => {
          dispatch(userDeleteApi(user.id)).finally(() => {
            dispatch(usersGetApi());
          });
        }}
      >
        delete User
      </Button>
    </li>
  );
};

export const Users = () => {
  const dispatch = useAppDispatch();
  const { list, RoleList, isLoading } = useAppSelector((st) => st.user);

  useEffect(() => {
    dispatch(usersGetApi());
    dispatch(RoleGetApi());
  }, [dispatch]);
  return (
    <>
      <ContentHeader className="users" title="Список пользователей" />
      <ContentMain>
        <ul>
          {list.map((x) => {
            return <UserItem RoleList={RoleList} user={x} key={x.id} />;
          })}
        </ul>
      </ContentMain>
      <Loader isLoading={isLoading} />
    </>
  );
};
