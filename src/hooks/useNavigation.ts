import { useNavigate } from "react-router-dom";

export function useNavigation() {
  const navigate = useNavigate();

  const goTo = (path: string) => {
    navigate(path);
  };

  const replace = (path: string) => {
    navigate(path, { replace: true });
  };

  const goBack = () => {
    navigate(-1);
  };

  return {
    goTo,
    goBack,
    replace,
  };
}
