import React from 'react';
import { SkeletonView } from 'react-native-ui-lib';
import { EditSimpleForkCard, EditSimpleCardProps } from '../edit-simple/index';

const EditAdvanceForkCardSkeleton: React.FC<EditSimpleCardProps> = (props) => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  React.useEffect(() => {
    setInterval(() => setLoaded(true), 500);
    return () => {
      setLoaded(false);
    };
  }, []);

  return (
    <SkeletonView
      template={SkeletonView.templates.TEXT_CONTENT}
      customValue={props}
      showContent={loaded}
      renderContent={
        // eslint-disable-next-line react/jsx-props-no-spreading
        (customProps: EditSimpleCardProps) => (<EditSimpleForkCard {...customProps} />)
      }
      times={2}
    />
  );
};

export default EditAdvanceForkCardSkeleton;
