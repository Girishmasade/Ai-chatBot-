import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { login as loginAction, logout as logoutAction, updateUser } from "../redux/slice/authSlice";
import { useLazyGetUsersQuery, useUpdateUserMutation } from "../redux/api/apiSlice";
import { User } from "../types";

export function useAuth() {
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [triggerGetUsers] = useLazyGetUsersQuery();
  const [updateUserMutation] = useUpdateUserMutation();

  const login = (email: string, name: string) => {
    dispatch(loginAction({ email, name }));
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const refreshCredits = async () => {
    try {
      const result = await triggerGetUsers(undefined, true).unwrap();
      if (result && currentUser) {
        const matching = result.find((u: User) => u.email === currentUser.email);
        if (matching) {
          dispatch(
            updateUser({
              credits: matching.credits,
              tier: matching.tier,
              role: matching.role,
              name: matching.name,
            })
          );
        }
      }
    } catch (e) {
      console.error("Failed to refresh credits:", e);
    }
  };

  const upgrade = async (tier: "free" | "basic" | "pro" | "enterprise", creditsToAdd: number) => {
    try {
      const users = await triggerGetUsers(undefined, true).unwrap();
      if (users && currentUser) {
        const match = users.find((u: User) => u.email === currentUser.email);
        if (match) {
          const payload = {
            id: match.id,
            tier,
            credits: match.credits + creditsToAdd,
          };
          await updateUserMutation(payload).unwrap();
          await refreshCredits();
        }
      }
    } catch (e) {
      console.error("Upgrade failed:", e);
    }
  };

  const updateName = async (newName: string) => {
    try {
      const users = await triggerGetUsers(undefined, true).unwrap();
      if (users && currentUser) {
        const match = users.find((u: User) => u.email === currentUser.email);
        if (match) {
          await updateUserMutation({ id: match.id, name: newName }).unwrap();
          await refreshCredits();
        }
      }
    } catch (e) {
      console.error("Update name failed:", e);
    }
  };

  return {
    isAuthenticated,
    currentUser,
    login,
    logout,
    refreshCredits,
    upgrade,
    updateName,
  };
}
