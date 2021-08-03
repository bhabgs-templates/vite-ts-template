import { defineComponent, reactive, ref } from 'vue';
import { Form, message } from 'ant-design-vue';
import code from '@/assets/img/code.png';
import { phoneNumber } from '@/utils/validation';

type LoginType = 1 | 2;

// submit 参数
export interface EventBySubmitParams {
  password: string;
  username: string;
  loginType: LoginType;
  msg?: string;
}
const aForm = Form;
const formItem = Form.Item;
// props
const props = {
  loginTab: {
    type: Array,
    default() {
      return [
        {
          name: '扫码登录',
          id: 1,
        },
        {
          name: '账号登录',
          id: 2,
        },
      ];
    },
  },
  password: {
    default: '',
  },
  username: {
    default: '',
  },
  autoMsg: Boolean,
};

export default defineComponent({
  components: { aForm, formItem },
  props,
  emits: ['submit'],
  setup(prop, context) {
    const loginType = ref<LoginType>(2);
    const formVal = reactive({
      password: prop.password,
      username: prop.username,
    });

    const sendMsg = (msg: string, type: 'error' | 'success') => {
      if (!props.autoMsg) return;

      if (type === 'error') {
        message.error(msg);
      }
      if (type === 'success') {
        message.success(msg);
      }
    };
    const renderLoginTab = () => {
      return (
        <div class='login_tab'>
          {prop.loginTab.map((item) => (
            <div
              class={['item', item.id === loginType.value ? 'active' : '']}
              onClick={() => {
                loginType.value = item.id as LoginType;
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      );
    };

    const handleSubmit = () => {
      const data: EventBySubmitParams = {
        username: formVal.username,
        password: formVal.password,
        loginType: loginType.value,
      };

      if (data.username === '' || !phoneNumber.test(data.username)) {
        data.msg = '手机号错误';
      }

      if (!data.password || data.password.length <= 7) {
        data.msg = `${data.msg} 密码输入错误`;
      }

      if (data.msg) {
        sendMsg(data.msg, 'error');
      }
      context.emit('submit', data);
    };

    const renderForm = () => {
      return (
        <aForm
          v-show={loginType.value === 2}
          layout='vertical'
          onSubmit={handleSubmit}
          wrapper-col={{
            span: 24,
          }}
        >
          <formItem wrapper-col={{ span: 50 }}>
            <a-input v-model={[formVal.username, 'value']}></a-input>
          </formItem>
          <formItem>
            <a-input
              type='password'
              v-model={[formVal.password, 'value']}
            ></a-input>
          </formItem>

          <formItem>
            <a-button type='primary' block html-type='submit'>
              登录
            </a-button>
          </formItem>
        </aForm>
      );
    };

    const renderLoginCode = () => {
      return (
        <div
          v-show={loginType.value === 1}
          style={{ width: '100%', textAlign: 'center' }}
        >
          <img src={code} alt='' style={{ width: '60%' }} />
          <p style={{ marginTop: '1rem' }}>请使用智信APP扫描二维码登录</p>
        </div>
      );
    };

    return () => (
      <div class='login_box'>
        {renderLoginTab()}
        <h3>智信PC客户端</h3>

        {renderForm()}
        {renderLoginCode()}
      </div>
    );
  },
});
