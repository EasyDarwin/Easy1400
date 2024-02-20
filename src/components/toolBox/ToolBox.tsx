import { ConfigProvider, FloatButton } from 'antd';
import { FloatButtonType } from 'antd/es/float-button/interface';

export interface ToolBoxProps {
  id: string;
  label?: string;
  icon?: React.ReactNode;
  type?: FloatButtonType | undefined;
  color?: string;
  onClick?: () => void;
}

const ToolBox: React.FC<{ data: ToolBoxProps[] }> = ({ data }) => {
  return (
    <div>
      <FloatButton.Group
        shape="square"
        className="fixed bottom-24 right-12 z-10"
      >
        {data.map((item: ToolBoxProps) => {
          return (
            <ConfigProvider
              key={item.id}
              theme={{
                token: {
                  colorText:item.color
                },
              }}
            >
              <FloatButton
                icon={item.icon}
                type={item.type}
                description={item.label}
                onClick={item.onClick}
              />
            </ConfigProvider>
          );
        })}
        <FloatButton.BackTop visibilityHeight={0} />
      </FloatButton.Group>
    </div>
  );
};

export default ToolBox;
